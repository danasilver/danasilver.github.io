## danasilver.org

The development repository for [www.danasilver.org](https://www.danasilver.org).

### Develop

Install the requirements to build the site:

```sh
pip install -r requirements.txt
```

The site is templated with [Jinja2](http://jinja.pocoo.org/) and generated using
[staticjinja](https://staticjinja.readthedocs.io/en/latest/). Build the site with:

```sh
python build.py
```

The generated site is in `_site/`.
Run an HTTP server from that directory for a preview.

### Deploy

Push to master to deploy.

#### How Deployment Works

Push to master triggers a
[GitHub Action](https://github.com/danasilver/danasilver.github.io/actions/workflows/deploy-to-s3.yaml),
which builds the static site, uploads to S3, and invalidates the Cloudfront distribution.

