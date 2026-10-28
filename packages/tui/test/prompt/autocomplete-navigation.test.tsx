import { TextareaRenderable } from "@opentui/core"
import { expect, test } from "bun:test"
import { createAppFixture } from "../fixture/app"

test.each([undefined, true, false])("autocomplete boundaries respect dialog.wrap=%s", async (wrap) => {
  await using setup = await createAppFixture({
    width: 100,
    height: 30,
    config: { animations: false, dialog: { wrap } },
  })
  await setup.ready
  await setup.waitFor(() => setup.renderer.currentFocusedRenderable instanceof TextareaRenderable)
  await setup.mockInput.pressKey("u", { ctrl: true })
  await setup.mockInput.typeText("/")
  await setup.waitForFrame((frame) => /\/(agents|cd|q|help)\s/.test(frame))
  await setup.renderOnce()
  const highlight = setup.captureSpans().lines.flatMap((line) => line.spans)
    .find((span) => span.text.trimStart().startsWith("/"))!.bg.toInts()
  function selected() {
    return setup.captureSpans().lines.flatMap((line) => line.spans)
      .filter((span) => span.text.trimStart().startsWith("/") &&
        span.bg.toInts().every((value, index) => value === highlight[index]))
      .map((span) => span.text.trim())
  }
  const first = selected()
  await setup.mockInput.pressArrow("up")
  await setup.renderOnce()
  const previous = selected()
  if (wrap === false) {
    expect(previous).toEqual(first)
    for (let i = 0; i < 100; i++) await setup.mockInput.pressArrow("up")
    await setup.renderOnce()
    expect(selected()).toEqual(first)
    for (let i = 0; i < 100; i++) await setup.mockInput.pressArrow("down")
    await setup.renderOnce()
    const last = selected()
    expect(last).not.toEqual(first)
    for (let i = 0; i < 100; i++) await setup.mockInput.pressArrow("down")
    await setup.renderOnce()
    expect(selected()).toEqual(last)
  } else {
    expect(previous).not.toEqual(first)
    await setup.mockInput.pressArrow("down")
    await setup.renderOnce()
    expect(selected()).toEqual(first)
  }
})
