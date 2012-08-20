import webapp2, re

p = re.compile("(https?://[^/]+/(?::\d+)?[^:]+)(:)(.+)")

class RedirectHandler(webapp2.RequestHandler):
    def get(self):
        url = p.sub('\\1-\\3', self.request.url)
        self.redirect(url, permanent=True)

app = webapp2.WSGIApplication([('/.*', RedirectHandler)])
