import webapp2
from google.appengine.ext.webapp import template


class IndexHandler(webapp2.RequestHandler):
  def get(self):
    fragment = self.request.get('_escaped_fragment_')

    if fragment:
      fragment = '/partials' + fragment + '.html'
      self.redirect(fragment, permanent=True)
    else:
      self.response.headers['Content-Type'] = 'text/html'
      self.response.out.write(template.render('index-nocache.html', None))


app = webapp2.WSGIApplication([('/', IndexHandler)])

