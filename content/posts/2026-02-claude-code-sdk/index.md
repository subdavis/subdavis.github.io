---
title: Claude Code SDK is pretty wild
date: 2026-02-11 22:00:00
description: Mixing claude with procedural code beyond one-shot i/o.
images: ["topreventwar.jpg"]
---

![Claude Code](./claude.webp)

I've been using claude code on and off since it launched a year ago. Since the Christmas holiday, it seems [a ton of folks outside the software industry have discovered it](https://www.theargumentmag.com/p/i-cant-stop-yelling-at-claude-code) as well.

Despite its popularity, I've seen almost no discussion of Claude Code SDK. It's essentially a typescript or [python](https://platform.claude.com/docs/en/agent-sdk/python) wrapper to the agent harness that allows you to fully manage the handoff between agentic and procedural parts of an application.

## Beyond `--print` mode

If you've discovered the `--print` flag, you've almost certainly scripted up some terrible nonsense to run it as a subprocess.

**Stop that right now!**

The [SDK documentation is dense](https://platform.claude.com/docs/en/api/sdks/python). It does not take the time to explain the basics of the turn loop or tool hooks. I suspect that most people who _have_ attempted to use the SDK have done so in a one-shot sort of way, by giving a prompt and letting Claude cook until it yields.

## Control handoff and tool use

Claude code is just a while loop.

```txt
until llm says stop:
   give llm some inputs
   do whatever it says (read file, run bash)
```

When you build an [agent `SKILL.md`](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), you hand-wavishly describe how to use an API or function or script. Claude reads those instructions and then uses its existing tools (read/write/bash/grep) to do whatever the skill describes.

> Claude is like the little dude inside the big dude's head
>
> -- Will Smith

![To Prevent War](./topreventwar.jpg)

When you build custom tools with the SDK, you must [implement an MCP tool interface](https://platform.claude.com/docs/en/agent-sdk/custom-tools), run it synchronously in-process, and hand the output back for the next turn.

## A Toy Example

The official docs provide [this example](https://platform.claude.com/docs/en/api/sdks/python#tool-helpers). It's a bit unsatisfying because it hides the details, so let's reimplement without the automagical `tool_runner`.

```python
from anthropic import Anthropic
import json

client = Anthropic()
max_turns = 10
SYSTEM_PROMPT = "System Prompt Here"
MESSAGES = [{"role": "user", "content": [{"type": "text", "text": "Tell me the weather in San Francisco." }]}]

# This is the MCP spec!
TOOLS = [{
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
            }
        },
        "required": ["location"]
    }
}]

def get_weather(location: str) -> str:
    return json.dumps(
        {
            "location": location,
            "temperature": "68°F",
            "condition": "Sunny",
        }
    )

for _ in range(max_turns):
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        tools=TOOLS,
        messages=MESSAGES,
    )

    if response.stop_reason == "tool_use":
        tool_results = []
        assistant_content = []

        for block in response.content:
            assistant_content.append(block)

            # Do what claude says
            if block.type == "tool_use":

                if block.name == "get_weather":
                    result = get_weather(block.input.get("location"))
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })

        # Append the request and response to the session log:
        # Claude says "Please run this tool"
        messages.append({"role": "assistant", "content": assistant_content})
        # User says "Here you go"
        messages.append({"role": "user", "content": tool_results})

    elif response.stop_reason == "end_turn":
        print("Claude exited.")
```

You'd miss it in the `beta.tool_runner` wrapper, but tool use blocks append to an ever-growing `messages` array that gets fed back into the client every turn.

**Thats exactly how claude code works**, and its why the SDK token use grows exponentially by turn.

## A working project

If you don't mind the mess, [here's a real project for updating a Google Calendar based on the posts from an RSS stream.](https://github.com/subdavis/bikegroups-org-calendar/blob/main/calendar_sync/claude.py)

When a post announces an upcoming event, the agent has 4 tools:

* `get_images`
* `search_events_by_date`
* `search_events_by_keyword`
* `submit_decision`

## Takeaway

Using the same harness framework and a completely different set of tools, claude code can do tasks entirely unrelated to writing code.
