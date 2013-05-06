from django.db import models

# Create your models here.
class Band(models.Model):
	name = models.CharField(max_length=128)

	def __unicode__(self):
		return unicode(self.name)


class Album(models.Model):
	name = models.CharField(max_length=128)
	release_date = models.DateField()
	band = models.ForeignKey(Band)

	def __unicode__(self):
		return u"%s - %s" % (self.band.name, self.name)


class Song(models.Model):
	name = models.CharField(max_length=128)
	lyrics = models.TextField()
	album = models.ForeignKey(Album)

	def __unicode__(self):
		return u"%s - %s" % (self.album.band.name, self.name)

						