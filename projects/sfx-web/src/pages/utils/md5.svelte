<script lang="ts">
  import '@/components/card.svelte'
  import {Module, QtLoader} from '@/utils/qtloader'
  import {getHost} from '@/utils/config'
  import {onMount} from 'svelte'

  let content = ''
  let result = ''
  let qtCanvasDom

  function initWasm () {
    window.Module = Module
    window.QtLoader = QtLoader
    Module.locateFile = function (path: string, prefix: string) {
      console.log('locateFile', path, prefix)
      return prefix + path
    }
    document.addEventListener('DOMContentLoaded', function () {
      console.log('3 seconds passed')
      const qtLoader = window.QtLoader({
        canvasElements: [qtCanvasDom],
        //showLoader: () => { },
        showError: function (errorMessage: string) {
          console.log('showError', errorMessage)
        },
        // showExit: function () {
        // },
        // showCanvas: function () {
        // }
      })
      const filePath = getHost() + '/wasm/qt-canvas'
      qtLoader.loadEmscriptenModule(filePath)
    })
  }

  onMount(() => initWasm())
</script>

<svelte:options tag="fx-md5"/>

<canvas bind:this={qtCanvasDom} contentEditable="true" onContextMenu="event.preventDefault()"
        style="display:none;"></canvas>

<div class={'encrypt-md5-page'}>
  <fx-card>

    <div class={'content-body'}>
      <div class={'row-content'}>
        <textarea class='fx-input' on:change={(event) => { content = event.target.value }}
                  placeholder={'请输入内容'}></textarea>
      </div>
      <div class={'row-calc'}>
        <button class='fx-button'
                on:click={() => {
                  result = window.Module.tryCalcMd5(content)
                }}>MD5
        </button>
        <button class='fx-button'
                on:click={() => {
                  result = window.Module.tryCalcBase64(content)
                }}>Base64
        </button>
        <button class='fx-button'
                on:click={() => {
                  result = window.Module.tryCalcHex(content)
                }}>HEX
        </button>
        <button class='fx-button'
                on:click={() => {
                  result = window.Module.tryCalcSha1(content)
                }}>SHA1
        </button>
        <button class='fx-button'
                on:click={() => {
                  result = window.Module.tryCalcSha256(content)
                }}>SHA256
        </button>
        <button class='fx-button'
                on:click={() => {
                  result = window.Module.tryCalcSha512(content)
                }}>SHA512
        </button>
      </div>
      <div class='row-result'>
        {result}
      </div>
    </div>
  </fx-card>

</div>

<style lang="scss">
  @import "src/styles/media";
  @import "src/styles/controls";

  .encrypt-md5-page {
    .row-content {
      display: flex;

      textarea {
        width: 100%;
        height: 64px;
      }
    }

    .row-calc {
      margin-top: 16px;

      > button {
        margin-right: 8px;
        margin-top: 8px;
      }
    }

    .row-result {
      margin-top: 16px;
      word-break: break-all;
    }

    @media (min-width: $screen-desktop) {
      .content-body {
        width: 960px;
        margin: 0 auto;
      }
    }
  }


</style>
