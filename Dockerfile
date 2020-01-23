FROM node

ARG HOST_USER_ID=1001
ARG HOST_GROUP_ID=1001
ARG CONT_USERNAME="host"
ARG CONT_GROUPNAME="host"
# ARG CONT_FILES=""

# create container user with same id as the host user
RUN groupadd -g ${HOST_GROUP_ID} ${CONT_GROUPNAME}
RUN useradd -l -u ${HOST_USER_ID} -g ${CONT_GROUPNAME} ${CONT_USERNAME}
RUN install -d -m 0755 -o ${CONT_USERNAME} -g ${CONT_GROUPNAME} /home/${CONT_USERNAME}

# switch to host user
USER ${CONT_USERNAME}

# Switch to the working directory
# NOTE: be sure to make the working directory explictly. If you let the WORKDIR
# command make it then it will be owned by root
RUN ["mkdir", "/home/host/biweb"]
WORKDIR /home/${CONT_USERNAME}/biweb

# Install the app dependencies and configuration
COPY --chown=host:host ["babel.config.js", ".browserslistrc", "cypress.json", ".eslintrc.js", ".npmrc", "tsconfig.json", "vue.config.js", ".env.development","./"]
COPY --chown=host:host ["package.json", "/home/host/biweb/package.json"]
RUN ["npm", "install"]

# start the web server
ENTRYPOINT ["npm", "run", "serve"]
