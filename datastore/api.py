from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields
from datastore.models import Band, Album, Song

class BandResource(ModelResource):
	class Meta:
		queryset = Band.objects.all()
		list_allowed_methods = ['get']
		resource_name = 'band'
		filtering = {
			'name': ALL
		}


class AlbumResource(ModelResource):
	band = fields.ForeignKey(BandResource, 'band')
	class Meta:
		queryset = Album.objects.all()
		list_allowed_methods = ['get']
		resource_name = 'album'
		filtering = {
			'band': ALL_WITH_RELATIONS,
			'name': ALL
		}


class SongResource(ModelResource):
	album = fields.ForeignKey(AlbumResource, 'album')
	class Meta:
		queryset = Song.objects.all()
		list_allowed_methods = ['get']
		resource_name = 'song'
		filtering = {
			'album': ALL_WITH_RELATIONS
		}
