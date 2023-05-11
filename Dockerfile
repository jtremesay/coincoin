FROM python AS base
RUN pip install -U pip setuptools wheel

# I hate modern days
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

FROM base AS deps
WORKDIR /opt/coincoin
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY ui/package.json ui/package.json
RUN npm install

COPY requirements.txt requirements.txt
RUN pip install -Ur requirements.txt

FROM deps AS src
COPY manage.py manage.py
COPY proj proj
COPY coincoin coincoin
COPY api api
COPY ui ui

FROM src AS static
RUN npm run build --workspace=ui
RUN SECRET_KEY="no-secret" python manage.py collectstatic --no-input

FROM static as serve
COPY entrypoint.sh entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/opt/coincoin/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "proj.wsgi"]
