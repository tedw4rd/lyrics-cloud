from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

from tastypie.api import Api
from datastore.api import BandResource, AlbumResource, SongResource

data_api = Api(api_name="v1")
data_api.register(BandResource())
data_api.register(AlbumResource())
data_api.register(SongResource())

from frontend.views import index

urlpatterns = patterns('',
    url(r'^$', index, name='index'),
    url(r'^api/', include(data_api.urls)),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
