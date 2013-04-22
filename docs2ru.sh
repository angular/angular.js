#!/usr/bin/env bash
# Convert *.ngdoc to *_ru.ngdoc

DOC_PATH="docs/content"
POSTFIX="ru"

if [ ! -e "$DOC_PATH" ]; then
  echo "Documentation does not exist..."
  exit
fi

convert(){
  local DIR_PATH="$1"
  local FULL_PATH=""
  local FILE_NAME=""
  local IS_RU=""

  for file in $(ls $DIR_PATH); do
    FULL_PATH="$DIR_PATH/$file"
    FILE_NAME=$(basename "$file")
    FILE_NAME=${FILE_NAME%.*}

    # is file
    if [ -f "$FULL_PATH" ]; then

      if [[ "ngdoc" == ${FULL_PATH##*.} ]]; then
        FILE_NAME="$DIR_PATH/${FILE_NAME}_${POSTFIX}.${FULL_PATH##*.}"
        IS_RU=${file##*_}
        IS_RU=${IS_RU%.*}

        if [[ "$IS_RU" == $POSTFIX ]]; then
          echo ""
        elif [ ! -e "$FILE_NAME" ]; then
          echo "$FULL_PATH" " -> " "$FILE_NAME"
          cp "$FULL_PATH" "$FILE_NAME"
        fi

      fi

    fi

    # is directory
    if [ -d "$FULL_PATH" ]; then
      convert "$FULL_PATH"
    fi

  done
}

convert $DOC_PATH
