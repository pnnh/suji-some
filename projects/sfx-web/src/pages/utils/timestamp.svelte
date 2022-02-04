<script lang="ts">
  import '@/components/card.svelte'

  const startUnix = Date.now()
  let timeString = new Date(startUnix).toUTCString()
  let timestamp = Math.floor(startUnix / 1000)

  setInterval(() => {
    const nowUnix = Date.now()
    timeString = new Date(nowUnix).toUTCString()
    timestamp = Math.floor(nowUnix / 1000)
  }, 1000)
</script>

<svelte:options tag="fx-timestamp"/>

<div class='timestamp-page'>
  <fx-card>
    <div class='content-body'>
      <h2>
        现在的时间是
      </h2>
      <h3>
        {timeString}
      </h3>
      <h2>
        现在时间戳是
      </h2>
      <h3>
        {timestamp}
      </h3>
    </div>
  </fx-card>
</div>

<style lang="scss">
  @import "src/styles/media";

  .timestamp-page {
    @media (min-width: $screen-desktop) {
      .content-body {
        width: 960px;
        margin: 0 auto;
      }
    }
  }
</style>

