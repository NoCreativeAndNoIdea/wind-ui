#! /bin/bash

NAME=$1


FILE_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")/../packages" && pwd)

re="[[:space:]]+"

if [ "$#" -ne 1 ] || [[ $NAME =~ $re ]] || [ "$NAME" == "" ]; then
  echo "Usage: pnpm gc \${name} with on space"
  exit 1
fi

DIRNAME="$FILE_PATH/$NAME"
INPUT_NAME=$NAME

if [ -d "$DIRNAME" ]; then
  echo "$NAME component already exists, please change it"
  exit 1
fi

echo "export * from './components/$NAME';" > $FILE_PATH/components/index.ts

NORMALIZED_NAME=""

for i in $(echo $NAME | sed 's/[_|-]\([a-z]\)/\ \1/;s/^\([a-z]\)/\ \1/'); do
  C=$(echo "${i:0:1}" | tr "[:lower:]" "[:upper:]")
  NORMALIZED_NAME="$NORMALIZED_NAME${C}${i:1}"
done
NAME=$NORMALIZED_NAME

mkdir -p "$DIRNAME"
mkdir -p "$DIRNAME/src"
mkdir -p "$DIRNAME/__tests__"

cat > $DIRNAME/src/index.vue <<EOF
<script lang='ts' setup>

defineOptions({
  'name': 'W${NAME}'
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style>
</style>
EOF

cat <<EOF >"$dirname/src/$NAME.ts" << EOF

EOF

cat <<EOF >"$DIRNAME/index.ts"
import { withInstall, withNoopInstall } from '@wind-ui/utils'
import ${NAME} from './src/${NAME}.vue'

export const D${NAME} = withInstall(${NAME})

export default DButton
export * from './src/${NAME}'
EOF

cat > $DIRNAME/__tests__/$INPUT_NAME.spec.ts <<EOF
import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import $NAME from '../src/index.vue'

const AXIOM = 'Rem is the best girl'

describe('$Name.vue', () => {
  test('render test', () => {
    const wrapper = mount($Name, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})

EOF
