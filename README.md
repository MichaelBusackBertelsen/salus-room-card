# SALUS Climate Card

A standalone HACS dashboard card for a climate entity, optional floor-comfort
select, humidity and click-to-expand history. English is the default; Danish
follows Home Assistant's language. Any compatible climate entity can be used.

**Preview migration release.** This project separates the card from the SALUS
integration. Installing it does not create automations or change heating settings.
Your existing integration beta can remain installed during card testing.

## Install through HACS

1. HACS → menu → Custom repositories.
2. Add `https://github.com/MichaelBusackBertelsen/salus-room-card` as **Dashboard**.
3. Download the card. Enable beta versions to choose the preview release.
4. Reload the browser fully (Ctrl+F5 on Windows).
5. Add **SALUS Climate Card** to a dashboard and choose a climate entity.

HACS manages the JavaScript resource. If resources are managed in YAML, use
`/hacsfiles/salus-room-card/salus-room-card.js` as a JavaScript module.
Do not add a second resource when HACS already registered it.

```yaml
type: custom:salus-climate-card
climate: climate.example
comfort: select.example_floor_comfort # Optional
layout: rows                        # Or compact
history_hours: 48
```

The new element name `salus-climate-card` can coexist with the old integration's
bundled `salus-room-card`. To migrate a card, edit its type (or add a new card),
retaining the entity IDs and layout. No dashboard or integration entry is deleted.

## Independent weather-blueprint diagnostics

The optional [standalone blueprint](https://github.com/MichaelBusackBertelsen/salus-comfort-blueprint)
uses standard HA helpers. To show that room's timers/decisions, select the same
Text helper and shared automation in the card editor, or add:

```yaml
comfort_state: input_text.example_comfort_state
comfort_automation: automation.example_comfort
```

The card only reads these helpers; it never creates, resets or modifies them.
Timing/decision information appears **only when expanded**, above the graph.
The Activity button opens the exact floor entity. Older beta attributes remain
readable for migration, but a custom SALUS controller is not required.

Pending levels marked with HA's standard `assumed_state` are not treated as
device-confirmed. Recorded activation is distinct from discovering an already
active room. The next evaluation is not a guaranteed switch-off time.

## History and optional entities

History is loaded only when expanded, using your HA Recorder. It plots measured
and target temperatures as steps, with the thermostat's reported heating state.
Unknown demand remains unknown. Retention/filters follow your HA configuration.
Without a comfort select, thermostat controls and history continue to work and
floor controls are disabled. Separate temperature/humidity sensors are optional.

## Development

Node 24. `npm install`, `npm run build`, `npm test`. Browser tests simulate HA
entities/services and cover desktop, touch, startup ordering, translations,
responsive layout, helper diagnostics and read-only history. They do not change
a running HA installation or physical thermostat.

MIT license and upstream notices are retained in both this repository and the
downloaded JavaScript bundle. See [Danish setup](README.da.md).
