# Copyright 2009 The Closure Library Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


"""Class to represent a full Closure Library dependency tree.

Offers a queryable tree of dependencies of a given set of sources.  The tree
will also do logical validation to prevent duplicate provides and circular
dependencies.
"""

__author__ = 'nnaze@google.com (Nathan Naze)'


class DepsTree(object):
  """Represents the set of dependencies between source files."""

  def __init__(self, sources):
    """Initializes the tree with a set of sources.

    Args:
      sources: A set of JavaScript sources.

    Raises:
      MultipleProvideError: A namespace is provided by muplitple sources.
      NamespaceNotFoundError: A namespace is required but never provided.
    """

    self._sources = sources
    self._provides_map = dict()

    # Ensure nothing was provided twice.
    for source in sources:
      for provide in source.provides:
        if provide in self._provides_map:
          raise MultipleProvideError(
              provide, [self._provides_map[provide], source])

        self._provides_map[provide] = source

    # Check that all required namespaces are provided.
    for source in sources:
      for require in source.requires:
        if require not in self._provides_map:
          raise NamespaceNotFoundError(require, source)

  def GetDependencies(self, required_namespaces):
    """Get source dependencies, in order, for the given namespaces.

    Args:
      required_namespaces: A string (for one) or list (for one or more) of
        namespaces.

    Returns:
      A list of source objects that provide those namespaces and all
      requirements, in dependency order.

    Raises:
      NamespaceNotFoundError: A namespace is requested but doesn't exist.
      CircularDependencyError: A cycle is detected in the dependency tree.
    """
    if isinstance(required_namespaces, str):
      required_namespaces = [required_namespaces]

    deps_sources = []

    for namespace in required_namespaces:
      for source in DepsTree._ResolveDependencies(
          namespace, [], self._provides_map, []):
        if source not in deps_sources:
          deps_sources.append(source)

    return deps_sources

  @staticmethod
  def _ResolveDependencies(required_namespace, deps_list, provides_map,
                           traversal_path):
    """Resolve dependencies for Closure source files.

    Follows the dependency tree down and builds a list of sources in dependency
    order.  This function will recursively call itself to fill all dependencies
    below the requested namespaces, and then append its sources at the end of
    the list.

    Args:
      required_namespace: String of required namespace.
      deps_list: List of sources in dependency order.  This function will append
        the required source once all of its dependencies are satisfied.
      provides_map: Map from namespace to source that provides it.
      traversal_path: List of namespaces of our path from the root down the
        dependency/recursion tree.  Used to identify cyclical dependencies.
        This is a list used as a stack -- when the function is entered, the
        current namespace is pushed and popped right before returning.
        Each recursive call will check that the current namespace does not
        appear in the list, throwing a CircularDependencyError if it does.

    Returns:
      The given deps_list object filled with sources in dependency order.

    Raises:
      NamespaceNotFoundError: A namespace is requested but doesn't exist.
      CircularDependencyError: A cycle is detected in the dependency tree.
    """

    source = provides_map.get(required_namespace)
    if not source:
      raise NamespaceNotFoundError(required_namespace)

    if required_namespace in traversal_path:
      traversal_path.append(required_namespace)  # do this *after* the test

      # This must be a cycle.
      raise CircularDependencyError(traversal_path)

    # If we don't have the source yet, we'll have to visit this namespace and
    # add the required dependencies to deps_list.
    if source not in deps_list:
      traversal_path.append(required_namespace)

      for require in source.requires:

        # Append all other dependencies before we append our own.
        DepsTree._ResolveDependencies(require, deps_list, provides_map,
                                      traversal_path)
      deps_list.append(source)

      traversal_path.pop()

    return deps_list


class BaseDepsTreeError(Exception):
  """Base DepsTree error."""

  def __init__(self):
    Exception.__init__(self)


class CircularDependencyError(BaseDepsTreeError):
  """Raised when a dependency cycle is encountered."""

  def __init__(self, dependency_list):
    BaseDepsTreeError.__init__(self)
    self._dependency_list = dependency_list

  def __str__(self):
    return ('Encountered circular dependency:\n%s\n' %
            '\n'.join(self._dependency_list))


class MultipleProvideError(BaseDepsTreeError):
  """Raised when a namespace is provided more than once."""

  def __init__(self, namespace, sources):
    BaseDepsTreeError.__init__(self)
    self._namespace = namespace
    self._sources = sources

  def __str__(self):
    source_strs = map(str, self._sources)

    return ('Namespace "%s" provided more than once in sources:\n%s\n' %
            (self._namespace, '\n'.join(source_strs)))


class NamespaceNotFoundError(BaseDepsTreeError):
  """Raised when a namespace is requested but not provided."""

  def __init__(self, namespace, source=None):
    BaseDepsTreeError.__init__(self)
    self._namespace = namespace
    self._source = source

  def __str__(self):
    msg = 'Namespace "%s" never provided.' % self._namespace
    if self._source:
      msg += ' Required in %s' % self._source
    return msg
