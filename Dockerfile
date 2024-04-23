# Docker descriptor for online_bank
# License - http://www.eclipse.org/legal/epl-v20.html

FROM dirigiblelabs/dirigible:latest

COPY dirigible-bank-server target/dirigible/repository/root/registry/public/dirigible-bank-server
COPY dirigible-bank-server-data target/dirigible/repository/root/registry/public/dirigible-bank-server-data

ENV DIRIGIBLE_HOME_URL=/services/web/dirigible-bank-server/gen/index.html

ENV DIRIGIBLE_SINGLE_TENANT_MODE_ENABLED: true

EXPOSE 8080
