### PSQL

```
psql -U postgres
```


### serializers

https://www.django-rest-framework.org/api-guide/serializers/

### models

https://docs.djangoproject.com/en/4.2/topics/db/models/#field-types
https://docs.djangoproject.com/en/4.2/ref/models/fields/
https://docs.djangoproject.com/en/3.1/ref/models/fields/#django.db.models.JSONField

### postgis

#### mac

```
https://docs.djangoproject.com/en/4.2/ref/contrib/gis/install/#macos
```

```sh
$ brew install postgresql
$ brew install postgis
$ brew install gdal
$ brew install libgeoip
```

#### windows
```
https://docs.djangoproject.com/en/4.2/ref/contrib/gis/install/#windows
```

```sh
PS C:\dev\src\notion-weather> .\env\Scripts\activate
(env) PS C:\dev\src\notion-weather> psql -U postgres -c 'create extension postgis' notion-weather -l
psql: warning: extra command-line argument "-l" ignored
Password for user postgres:
CREATE EXTENSION
(env) PS C:\dev\src\notion-weather> psql -U postgres -c 'create extension postgis_topology' notion-weather -l
psql: warning: extra command-line argument "-l" ignored
Password for user postgres:
CREATE EXTENSION
(env) PS C:\dev\src\notion-weather>
```