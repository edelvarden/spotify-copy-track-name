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

  /**
   * Creates a copy button element.
   * @param {Array} favoriteButtonClassList - List of classes for the button.
   * @returns {HTMLElement} - The copy button element.
   */
  const createCopyButton = (favoriteButtonClassList) => {
    const copyTrackNameButton = document.createElement("button")
    copyTrackNameButton.classList.add("copy-button")
    if (favoriteButtonClassList) {
      copyTrackNameButton.classList.add(...favoriteButtonClassList)
    }
    copyTrackNameButton.setAttribute(
      "aria-label",
      "Copy track name to clipboard"
    )

    const copyIcon = createCopyIcon()
    const checkIcon = createCheckIcon()
    checkIcon.style.display = "none"

    copyTrackNameButton.appendChild(copyIcon)
    copyTrackNameButton.appendChild(checkIcon)

    copyTrackNameButton.addEventListener("click", () => {
      copyToClipboard()
      showCheckIcon(checkIcon, copyIcon)
    })

    return copyTrackNameButton
  }

  // Create the SVG icon for the button
  const createCopyIcon = () => {
    const copyIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    )
    copyIcon.setAttribute("height", "20")
    copyIcon.setAttribute("viewBox", "0 -960 960 960")
    copyIcon.setAttribute("width", "20")
    copyIcon.setAttribute("fill", "currentColor")
    copyIcon.innerHTML = `
    <path d="M216-96q-29.7 0-50.85-21.15Q144-138.3 144-168v-552h72v552h456v72H216Zm144-144q-29.7 0-50.85-21.15Q288-282.3 288-312v-480q0-29.7 21.15-50.85Q330.3-864 360-864h384q29.7 0 50.85 21.15Q816-821.7 816-792v480q0 29.7-21.15 50.85Q773.7-240 744-240H360Zm0-72h384v-480H360v480Zm0 0v-480 480Z"/>
  `
    return copyIcon
  }

  // Create the check SVG icon
  const createCheckIcon = () => {
    const checkIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    )
    checkIcon.setAttribute("height", "24")
    checkIcon.setAttribute("viewBox", "0 -960 960 960")
    checkIcon.setAttribute("width", "24")
    checkIcon.setAttribute("fill", "#1ed760")
    checkIcon.innerHTML = `
    <path d="M395-285 226-455l50-50 119 118 289-288 50 51-339 339Z"/>
  `
    return checkIcon
  }

  /**
   * Copies track information to the clipboard.
   */
  const copyToClipboard = async () => {
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
  }

  const showCheckIcon = (checkIcon, svgIcon) => {
    checkIcon.style.display = "inline"
    svgIcon.style.display = "none"

    afterDelay(() => {
      checkIcon.style.display = "none"
      svgIcon.style.display = "inline"
    }, 2000)
  }

  /**
   * Waits for required elements to load and adds the copy button.
   */
  const waitForElements = async () => {
    const favoriteButton = document.querySelector("[data-testid='add-button']")
    const favoriteButtonClassList = favoriteButton
      ? Array.from(favoriteButton.classList)
      : null

    const nowPlayingWidget = document.querySelector(
      "[data-testid='now-playing-widget']"
    )

    if (nowPlayingWidget) {
      nowPlayingWidget.appendChild(createCopyButton(favoriteButtonClassList))
    } else {
      afterDelay(waitForElements, 1000)
    }
  }

  // Entry point
  window.addEventListener("load", waitForElements)
})()
