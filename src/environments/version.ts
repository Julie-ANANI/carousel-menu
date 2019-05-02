// this file will be overwritten in the Dockerfile with the following command:
// if [ $VERSION ]; then sed -i -e "s/latest/$VERSION/g" src/environments/version.ts; fi

export const version = 'latest';
