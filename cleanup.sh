#!/bin/sh

# Remove hidden files
rm -rf .dockerignore .drone.yml .editorconfig .eslintrc.json .git .gitignore
echo "Hidden files removed"

# Remove Docker related files
rm -f  Dockerfile*
echo "Docker files removed"

# Remove unused dirs
rm -rf builders hooks assets node_modules src doc e2e
echo "Unused dirs removed"

# Remove config files
rm -rf tsconfig.* webpack.server.config.js angular.json tsconfig.json *.md
echo "Config files removed"
