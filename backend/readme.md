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

Make sure to install Postgres
```sh
pip install psycopg2
```

GIS Install
```sh
https://trac.osgeo.org/osgeo4w/
```

Follow steps here to setup some registry keys
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

```py
import os
if os.name == 'nt':
    import platform
    OSGEO4W = r"C:\OSGeo4W"
    if '64' in platform.architecture()[0]:
        OSGEO4W += "64"
    assert os.path.isdir(OSGEO4W), "Directory does not exist: " + OSGEO4W
    os.environ['OSGEO4W_ROOT'] = OSGEO4W
    os.environ['GDAL_DATA'] = OSGEO4W + r"\share\gdal"
    os.environ['PROJ_LIB'] = OSGEO4W + r"\share\proj"
    os.environ['PATH'] = OSGEO4W + r"\bin;" + os.environ['PATH']
```
Possible to need to change, or add the line item here... check 

```sh
C:\Dev\src\notion-weather\env\Lib\site-packages\django\contrib\gis\gdal\libgdal.py
```

Add the above code in your settings.py. Then, run `python manage.py check` if you got the error still, please go to C:\OSGeo4W64 or C:\OSGeo4W (C:\OSGeo4W\bin). There you can find gdalxxx.dll. please rename the file name to 'gdal202' or 'gdal203' in error message. Please run `python manage.py check`.

# Research

```text
https://registry.opendata.aws/collab/noaa/
```

Need to research and see if this is a better option than tomorrow.io for weather and other information that I want to include in the future.