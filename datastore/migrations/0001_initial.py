# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Band'
        db.create_table(u'datastore_band', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=128)),
        ))
        db.send_create_signal(u'datastore', ['Band'])

        # Adding model 'Album'
        db.create_table(u'datastore_album', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=128)),
            ('release_date', self.gf('django.db.models.fields.DateField')()),
            ('band', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['datastore.Band'])),
        ))
        db.send_create_signal(u'datastore', ['Album'])

        # Adding model 'Song'
        db.create_table(u'datastore_song', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=128)),
            ('lyrics', self.gf('django.db.models.fields.TextField')()),
            ('album', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['datastore.Album'])),
        ))
        db.send_create_signal(u'datastore', ['Song'])


    def backwards(self, orm):
        # Deleting model 'Band'
        db.delete_table(u'datastore_band')

        # Deleting model 'Album'
        db.delete_table(u'datastore_album')

        # Deleting model 'Song'
        db.delete_table(u'datastore_song')


    models = {
        u'datastore.album': {
            'Meta': {'object_name': 'Album'},
            'band': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['datastore.Band']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'release_date': ('django.db.models.fields.DateField', [], {})
        },
        u'datastore.band': {
            'Meta': {'object_name': 'Band'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '128'})
        },
        u'datastore.song': {
            'Meta': {'object_name': 'Song'},
            'album': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['datastore.Album']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lyrics': ('django.db.models.fields.TextField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '128'})
        }
    }

    complete_apps = ['datastore']