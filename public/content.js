(function () {
  /**
   * Delays the execution of a callback function.
   * @param {function} callback - The function to execute.
   * @param {number} delay - The delay duration in milliseconds.
   */
  const afterDelay = async (callback, delay) => {
    await new Promise((resolve) => setTimeout(resolve, delay))
    callback()
  }

  const configureCopyButton = (favoriteButtonClassList) => {
    const copyTrackNameButton = document.createElement("button")
    copyTrackNameButton.innerHTML = `<span style="display: flex;"><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor" ><path d="M216-96q-29.7 0-50.85-21.15Q144-138.3 144-168v-552h72v552h456v72H216Zm144-144q-29.7 0-50.85-21.15Q288-282.3 288-312v-480q0-29.7 21.15-50.85Q330.3-864 360-864h384q29.7 0 50.85 21.15Q816-821.7 816-792v480q0 29.7-21.15 50.85Q773.7-240 744-240H360Zm0-72h384v-480H360v480Zm0 0v-480 480Z"/></svg></span>`

    copyTrackNameButton.classList.add("copy-button")
    if (favoriteButtonClassList) {
      copyTrackNameButton.classList.add(...favoriteButtonClassList)
    }

    copyTrackNameButton.setAttribute(
      "aria-label",
      "Copy track name to clipboard"
    )

    copyTrackNameButton.addEventListener("click", async () => {
      const artistTitle = document.querySelector(
        "div[data-testid='context-item-info-subtitles']"
      )
      const trackName = document.querySelector(
        "div[data-testid='now-playing-widget'] div[title]"
      )

      if (artistTitle && trackName) {
        const artistText = artistTitle.textContent
        const trackText = trackName.getAttribute("title")
        const copyText = `${artistText} - ${trackText}`

        await navigator.clipboard.writeText(copyText)
      }
    })

    const nowPlayingWidget = document.querySelector(
      "[data-testid='now-playing-widget']"
    )

    if (nowPlayingWidget) {
      nowPlayingWidget.appendChild(copyTrackNameButton)
    } else {
      afterDelay(waitForElements, 1000)
    }
  }

  const waitForElements = async () => {
    const favoriteButton = document.querySelector("[data-testid='add-button']")
    const favoriteButtonClassList = favoriteButton
      ? Array.from(favoriteButton.classList)
      : null

    configureCopyButton(favoriteButtonClassList)
  }

  window.addEventListener("load", waitForElements)
})()
