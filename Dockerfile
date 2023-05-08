FROM python AS base
RUN pip install -U pip setuptools wheel

# I hate modern days
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

FROM base AS deps
WORKDIR /opt/coincoin
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY requirements.txt requirements.txt
RUN pip install -Ur requirements.txt

FROM deps AS src
COPY manage.py manage.py
COPY proj proj
COPY coincoin coincoin

FROM src AS static
RUN SECRET_KEY="no-secret" python manage.py collectstatic --no-input
RUN SECRET_KEY="no-secret" COMPRESS_OFFLINE=true python manage.py compress

FROM static as serve
COPY entrypoint.sh entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/opt/coincoin/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "proj.wsgi"]
