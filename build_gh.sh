#!/bin/sh

# Colors
ltblue='\033[1;34m'
NC='\033[0m' # No Color

echo
echo "${ltblue}Building Jekyll project ${PWD##*/}.${NC}"

# Build command
# Requires that danasilver.github.io be a sibling directory
jekyll build --destination ../danasilver.github.io

# Save the last commit message
message=$(git log -1 --pretty=%B)

# Change into the deploy directory
cd ../danasilver.github.io

# Create the CNAME record
echo
echo "${ltblue}Creating CNAME record...${NC}"
echo "www.danasilver.org" > CNAME

echo
echo "${ltblue}Moving 404 page...${NC}"
mv 404/index.html 404.html
rm -r 404

echo
echo "${ltblue}git status${NC}"
git status

# Commit the changes with the last commit message
# from the development repo
echo
echo "${ltblue}git add -A${NC}"
git add -A

echo "${ltblue}git commit -m '$message'${NC}"
git commit -m "$message"

echo
echo "${ltblue}git push origin master${NC}"

# Push the changes
git push origin master