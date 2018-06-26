'use strict';

/**
 * ! This is a private undocumented service !
 *
 * @name $$taskTrackerFactory
 * @description
 * A function to create `TaskTracker` instances.
 *
 * A `TaskTracker` can keep track of pending tasks (grouped by type) and can notify interested
 * parties when all pending tasks (or tasks of a specific type) have been completed.
 *
 * @param {$log} log - A logger instance (such as `$log`). Used to log error during callback
 *     execution.
 *
 * @this
 */
function $$TaskTrackerFactoryProvider() {
  this.$get = valueFn(function(log) { return new TaskTracker(log); });
}

function TaskTracker(log) {
  var self = this;
  var taskCounts = {};
  var taskCallbacks = [];

  var ALL_TASKS_TYPE = self.ALL_TASKS_TYPE = '$$all$$';
  var DEFAULT_TASK_TYPE = self.DEFAULT_TASK_TYPE = '$$default$$';

  /**
   * Execute the specified function and decrement the appropriate `taskCounts` counter.
   * If the counter reaches 0, all corresponding `taskCallbacks` are executed.
   *
   * @param {Function} fn - The function to execute.
   * @param {string=} [taskType=DEFAULT_TASK_TYPE] - The type of task that is being completed.
   */
  self.completeTask = completeTask;

  /**
   * Increase the task count for the specified task type (or the default task type if non is
   * specified).
   *
   * @param {string=} [taskType=DEFAULT_TASK_TYPE] - The type of task whose count will be increased.
   */
  self.incTaskCount = incTaskCount;

  /**
   * Execute the specified callback when all pending tasks have been completed.
   *
   * If there are no pending tasks, the callback is executed immediately. You can optionally limit
   * the tasks that will be waited for to a specific type, by passing a `taskType`.
   *
   * @param {function} callback - The function to call when there are no pending tasks.
   * @param {string=} [taskType=ALL_TASKS_TYPE] - The type of tasks that will be waited for.
   */
  self.notifyWhenNoPendingTasks = notifyWhenNoPendingTasks;

  function completeTask(fn, taskType) {
    taskType = taskType || DEFAULT_TASK_TYPE;

    try {
      fn();
    } finally {
      decTaskCount(taskType);

      var countForType = taskCounts[taskType];
      var countForAll = taskCounts[ALL_TASKS_TYPE];

      // If at least one of the queues (`ALL_TASKS_TYPE` or `taskType`) is empty, run callbacks.
      if (!countForAll || !countForType) {
        var getNextCallback = !countForAll ? getLastCallback : getLastCallbackForType;
        var nextCb;

        while ((nextCb = getNextCallback(taskType))) {
          try {
            nextCb();
          } catch (e) {
            log.error(e);
          }
        }
      }
    }
  }

  function decTaskCount(taskType) {
    taskType = taskType || DEFAULT_TASK_TYPE;
    if (taskCounts[taskType]) {
      taskCounts[taskType]--;
      taskCounts[ALL_TASKS_TYPE]--;
    }
  }

  function getLastCallback() {
    var cbInfo = taskCallbacks.pop();
    return cbInfo && cbInfo.cb;
  }

  function getLastCallbackForType(taskType) {
    for (var i = taskCallbacks.length - 1; i >= 0; --i) {
      var cbInfo = taskCallbacks[i];
      if (cbInfo.type === taskType) {
        taskCallbacks.splice(i, 1);
        return cbInfo.cb;
      }
    }
  }

  function incTaskCount(taskType) {
    taskType = taskType || DEFAULT_TASK_TYPE;
    taskCounts[taskType] = (taskCounts[taskType] || 0) + 1;
    taskCounts[ALL_TASKS_TYPE] = (taskCounts[ALL_TASKS_TYPE] || 0) + 1;
  }

  function notifyWhenNoPendingTasks(callback, taskType) {
    taskType = taskType || ALL_TASKS_TYPE;
    if (!taskCounts[taskType]) {
      callback();
    } else {
      taskCallbacks.push({type: taskType, cb: callback});
    }
  }
}
