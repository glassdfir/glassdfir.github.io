---
layout: post
title: "Reverse-Engineering a FitRx EMS App into a Python Controller"
date:   2026-10-26 11:00:00 -0400
categories: blogsabout
slug: reverse-engineering-a-fitrx-ems-app
redirect_from:
  - /blog/FitRx-Reverse-Engineering/
---

> **Short on time?** [Explore this post as a graph in Spoke](https://jon.glass/spoke/#name=FitRx%20reverse%20engineering&src=source&tgt=target&rel=relation&stype=source_type&ttype=target_type&layout=web&input=H4sIAAAAAAAC_4VXTXPbNhC961fs6NDmg0zkpG3aeHqQZSdxbTce22l7y0AkKCICAQ4ASta_71uQlGhbSi7iF7Bvsfv27crbxmUyCcItZEh8fPoaNnX_qr13UougrElyGYTSow8q3NzT2dUtZdYEZ7WWLpk1PtiKnG2CMtIntbPfZBaShRW6_RnfiKqmpk6otDpPyPFjbtcGt9KHY_zWUgQqrCNBXgYKqpLj_XD_SJPzurqmtTU_B1LGB6H1FhfXuZZVUtmgViLI_Ot8k0yxvNBisZA5CU_BWoIrHaKRa-loanJnVU51aY3cj92-XCvERXrPX7eopXD5WjiZ5E6tEIXxrJSiphPdSICFkjzO1CCc1iU7k_DAIXaCrkR2Yu2yP_MDiPbV9PpiB-JtEeLNzhKfsotNf5LMVrUwyB9Ha7Qz803k9zsTcE8jwbxYsZ21CmVy1ziDMJWSN9BcZEvEOVhkSuQC4aW_xEoMTJ6bZokYbo97ocIOQau5E26TNB6BObk8o7WDQ9IdxywaucLODCn0-KCCnOGYIgvSKcQsoxyxyILeDNAijJShvIPvr-evvsGZYUzyNjAC1Ehm1hjs5yhUwogFsPiETLRMGDKiklQoDbjRXrPTLJM1WES5XKlMxg2-xSiUyZVZoExWUmjk_NPNRTo5-u0kodbXf9s0vuif37179-bFeHCQK-E9XLqCp1P4uFJh8yqbPHt-6DC3gEPws9IuJdUWKXlPpbwHuRy-gNbUhhdRHB20vS9XEabPU8xFcoa0bJhDCFtOWgrQOjKCk1ZKJwfnKH6QhGuVLT19nN7dwfdhdj3NN_Tly_kp1U4W6n60tXQbAAu-44NFfiQ966P7vDWO98FmkbtFFJ7xrXQxRUK-FUkbBb6fJ2SgBcWGH7LxDoLT0Zv_kc2iKCa9Tdz_urWJh1-OqTEBSibz8eh7fh9N0vmGDUABB2A9j6BGlQjJdEbTU5r8Ri-30X9Jb6lG3CqP25VA5nA9mdHJ6TH8QEwl4ttUowcnmt71-_1BrPG1RoIoyPtAvslKFsfp3cvZ1efTsz9xYBlXo_ZpdnP5YTx6eIJznNp4EIueTSfPt7Y71O31EvWhaZL-wdahNKoSGmW9UME_MniFJMDW0WFb1-gYaBBH6e8_NHaHJuJg7c1ha1fKNEgcm_p09t97ejOhqnulPDqRCfzp6Jf97eB6E9Arhm_6brAtg3kDaQF8cPdfrUOeUKncA17VG4qKlH2-HT21A4UVywMCOrNO7tpKY3IcksuytDaPbMgti8Qeq9-j5hZryxSPnrz0yWejN9Q3HkLlNlCHDbV03wPCvd7TT5Q3oEW2yaB_O-MF2nyDq6pqtGiEF5IWJNarLZMsdwPu_0y6fuMenNnleezoe6zL-9pypNK0Yj6laTvTpDuQNGX30ugeHuJA0l5Snkt4C5NnD-ynPhJxQeyMGH_qnRNeFDJs-sutDK1oNkaFnz2x8XZnoZxHzVlS-C0bLLNFQaqIq33mVB1Aa-lHhxAH9O7AelZHmuwLWXD65YxpnYPc3_NaLQyqqoQxHXuzyaRuzxGEXx7DeRNZ0JrSbX3vQby0TR6RqMD82Awnl0eIYuOpZi2C1T4I3dKdAX-Mpsez2rwJAUiq9QlDiSaZ8rK9hFyDrUy3gH6m7eKQD5d24VtVV1kce4nFxMdxAcNt5KhDmwqx1Zay2q8K03Nohkd346htFYGnOQzS7cUn_1q35FFUo1a9Akk_SgiPGj3c_MXLotFxSuVzLtDk84eWklLqWubJ-AJDLMXBjnxtAw8sbZ_Hs8AsuC4V1D1WfTfGYfC6D-NHiB8bmJXMDp6cWfwKlLx_BLqw4evawfVkfG5WKGMsjaXWDkeUNc6xdjphFqyu6GC7DLSd5zHwqU0R-pJD21b1IcQ0revWJO5K4SVK2bXpAjMkVBUMqh0nK-d_FhUEJR_t1OIJUK8aHVK3I9mf3L9jo2TJ2mY22NwmHMtkNPh6B31sC-Zh1cbVu58LpfWw4uNoCg2vRQ6yAxgyUW0FZCcUo0P2D6lFROuIDoUFx1kjBg7POqyumOl1Z2Hy2OWum1MlheF6IdRG3eBfXLceVcl_y1xjONU83A9hTmUWiTIoM_8EwS660uOwMl-lAHn7YYjb8tDkDZf_gH5PrNllLFf8A-We0o2wEGOMEvGPr38QBy2anIsELfDJyQN1n8FaFyILRf6tYSEHe_gso_8B_sZG3FoPAAA): the decompiled app, the protocol, the Python controller, its safety features and what's next, all as clickable nodes.

## Why I went down this road

I recently tore my ACL, and part of getting my quad working again is retraining it with a TENS machine.

I ended up with a working Python script that drives a FitRx wireless EMS unit from my MacBook, and I got there by decompiling the vendor's Android app. I did most of the digging alongside Gemini, pasting terminal output back and forth until the protocol fell out.

<a href="https://www.walmart.com/ip/FitRx-Electrode-Wireless-Massager-Rechargeable-TENS-Unit-Muscle-Stimulator-with-App-Control/821289612"><img src="{{ site.baseurl }}/images/fitrx.jpg" alt="FitRx Electrode Wireless Massager" width="300"></a>

The unit I used: the [FitRx Electrode Wireless Massager](https://www.walmart.com/ip/FitRx-Electrode-Wireless-Massager-Rechargeable-TENS-Unit-Muscle-Stimulator-with-App-Control/821289612) from Walmart.

The goal was simple. I had a cheap stimulator, and I wanted custom routines it doesn't offer: a slow ramp up, a hold, a ramp down, a rest, repeated for a set time. Eventually I want Claude to be able to kick off and adjust those sessions for me.

The catch: the FitRx companion app wouldn't even install on my Android phone. It was flagged as too old for my "too new" phone. So if I wanted app control at all, I had to build it myself.

## Decompiling the APK

My first attempt at sharing the app's code was a mistake: I pasted the raw APK contents, which is just a ZIP archive full of compressed class files. Useless. The right tool is [jadx](https://github.com/skylot/jadx), which turns the APK back into readable Java:

```bash
brew install jadx
jadx -d fitrx_src /path/to/FitRx.apk
cd fitrx_src
```

Then I started grepping for the obvious Bluetooth write call:

```bash
grep -rn "writeCharacteristic" .
```

Every hit was inside `sources/com/inuker/bluetooth/library/`. That's Inuker BluetoothKit, an Android BLE wrapper library. It hides the raw GATT calls, so the app's own code never calls `writeCharacteristic` directly. I needed to find where the app called into the library instead.

Grepping the app's own package for "write" only turned up Android `Parcel` boilerplate. So I listed the package to get the lay of the land:

```bash
ls -R sources/com/fitrx/songhua/massagetool/
```

Two folders stood out: `BlueteethTool/` (yes, "Blueteeth") and `massagemain/`, which holds the main control screen.

## Following the trail

**Device names.** `BlueteethTool/b.java` is the connection manager. Its scan callback only accepts devices with these names, which told me what to look for when scanning:

```java
if (hVar.b().equals("HRK-016B")
    || hVar.b().toLowerCase().startsWith("FitRx Wireles".toLowerCase())
    || hVar.b().toLowerCase().startsWith("FitRx 7772".toLowerCase())) {
```

HRK-016B looks like the OEM board model. The same file also counts connections in SharedPreferences and has a check that returns false after 35 or 130 connects. I never confirmed where that check is used, so I'm filing it under "interesting" rather than "explains everything."

**The Bluetooth client.** `BlueteethTool/c.java` is just a singleton that hands out the Inuker client. So I grepped for every caller:

```bash
grep -rn "c\.a()" sources/com/fitrx/songhua/massagetool/
```

The interesting hits were in `MassageMainActivity.java`. One method, `c0`, is the single choke point where every command leaves the app. It takes a hex string, converts it to bytes, and writes it:

```java
private void c0(String str) {
    Log.e("BLE", "postMessage : " + str);
    com.inuker.bluetooth.library.a aVarA = c.a();
    com.fitrx.songhua.massagetool.f.b bVar = this.D;
    aVarA.c(bVar.f934b, bVar.c().c, this.D.c().f936b,
            com.inuker.bluetooth.library.n.c.c(str), this.H);
}
```

**The UUIDs.** `bVar.c()` and `bVar.b()` come from `f/b.java`, which walks the device's GATT services and picks characteristics by prefix. There are two profiles, chosen by whether the device name starts with "FitRx 7772":

```java
if (d()) {  // "FitRx 7772"
    if (svc.startsWith("0000fff0") && chr.startsWith("0000fff5")) this.e = cVar;  // write
    if (svc.startsWith("0000fff0") & chr.startsWith("0000fff4")) this.f = cVar;   // notify
} else {
    if (svc.startsWith("0000ae3a") && chr.startsWith("0000ae3b")) this.e = cVar;  // write
    if (svc.startsWith("0000ae3a") && chr.startsWith("0000ae3c")) this.f = cVar;  // notify
}
```

**The commands.** Finally, the methods just above `c0` build the strings. Here's intensity:

```java
public void W(int i2) {
    String str = String.format("%02d", Integer.valueOf(i2));
    c0("ACAD06A0000000" + str + "BCBD");
}
```

Mode and timer follow the same pattern with `A1` and `A2`. Each one also has a twin that sends something completely different for the 7772 profile.

## Decoding the protocol

The standard profile uses a fixed 10-byte frame. It opens with `AC AD 06`, then a command byte, three parameter bytes, the value, and closes with `BC BD`. No checksum.

The 7772 strings looked like noise until I decoded the hex as ASCII. `41542B434D4F44453D302C` is just `AT+CMODE=0,`. That profile speaks plain-text AT commands ending in `\r\n`.

| Command | Standard (HRK-016B) | 7772 variant |
| --- | --- | --- |
| Intensity | `ACAD06A0000000{level:02d}BCBD` | `AT+CSTR=1,{level}\r\n` |
| Mode | `ACAD06A1000000{mode:02d}BCBD` | `AT+CMODE=0,{mode}\r\n` |
| Timer (minutes) | `ACAD06A2010100{minutes:02X}BCBD` | `AT+CDCLK=00{mm}00\r\n` |
| Timer off | `ACAD06A200000000BCBD` | `AT+CDCLK=000000\n\r\n` |
| Write / notify UUIDs | `ae3b` / `ae3c` on service `ae3a` | `fff5` / `fff4` on service `fff0` |

Two quirks are worth noting. Intensity and mode are formatted as *decimal* digits (`%02d`), but the timer is formatted as *hex* (`Integer.toHexString`). So a 20-minute timer is sent as `14`. And the 7772 "timer off" string really does have that odd `\n\r\n` ending; I copied it from the app as-is.

In Python, sending a frame is a one-liner with [bleak](https://github.com/hbldh/bleak):

```python
WRITE_UUID = "0000ae3b-0000-1000-8000-00805f9b34fb"
await client.write_gatt_char(WRITE_UUID, bytes.fromhex("ACAD06A000000003BCBD"), response=False)  # level 3
```

## Building the Python controller

macOS supports BLE natively, and bleak uses CoreBluetooth under the hood, so no dongle is needed. Two Mac-specific notes: your terminal needs Bluetooth permission under **System Settings > Privacy & Security > Bluetooth**, and macOS shows devices by a UUID instead of a MAC address.

**Scan and connect.** I reuse the app's own name filter, then subscribe to the notify characteristic:

```python
devices = await BleakScanner.discover(timeout=7.0)
for d in devices:
    name = (d.name or "").strip()
    if any(name.startswith(p) for p in ["HRK-016B", "FitRx Wireles", "FitRx 7772"]):
        self.device = d
        break

self.client = BleakClient(self.device.address)
await self.client.connect()
await self.client.start_notify(self.notify_uuid, self._notification_handler)
```

**Commands.** Each device command is a thin wrapper that clamps its input and builds the frame from the table above:

```python
async def set_intensity(self, level: int):
    level = max(0, min(level, 9))
    await self._send_payload(f"ACAD06A0000000{level:02d}BCBD")

async def set_timer(self, minutes: int):
    if minutes == 0:
        await self._send_payload("ACAD06A200000000BCBD")
    else:
        await self._send_payload(f"ACAD06A2010100{minutes:02X}BCBD")
```

**Ramps and duty cycles.** The unit only knows eight fixed modes and ten intensity levels. Everything else, like ramping and work/rest cycles, I do in software by stepping the intensity over time:

```python
async def _ramp(self, start_lvl, end_lvl, duration_sec):
    steps = abs(end_lvl - start_lvl)
    if steps == 0 or duration_sec <= 0:
        await self.massager.set_intensity(end_lvl)
        return
    interval = duration_sec / steps
    direction = 1 if end_lvl > start_lvl else -1
    current = start_lvl
    for _ in range(steps):
        current += direction
        await self.massager.set_intensity(current)
        await asyncio.sleep(interval)
```

The session loop then runs ramp up, hold, ramp down, and rest until the session time runs out.

**The CLI.** Gemini's first version had `--pps` and `--phase-duration` flags for frequency and pulse width. They didn't do anything; they were only printed. The unit doesn't expose those settings over Bluetooth, so I removed them. The flags that are left all do something real:

```bash
python3 fitrx_orchestrator.py \
  --mode 1 \
  --target-intensity 4 \
  --duty-cycle 10 20 \
  --ramp 5 \
  --ramp-down 2 \
  --timer 20
```

## Safety, and what the AI got wrong

This is a script that controls current going into my body, so I designed it to fail toward "off."

- **Hardware timer first.** Before anything else, the script sets the unit's own timer to the session length. If my Mac sleeps, crashes, or loses Bluetooth, the unit should still shut itself off.
- **Ctrl+C always sends a stop.** A signal handler turns Ctrl+C into a task cancellation, so the `finally` block always runs and sends level 0.
- **Loud failure.** If the software stop itself fails, the script says so plainly instead of exiting quietly.
- **Raw telemetry only.** I log notification bytes with timestamps but don't interpret them, because I haven't confirmed the format yet.

```python
async def main(cfg):
    task = asyncio.current_task()
    asyncio.get_running_loop().add_signal_handler(signal.SIGINT, task.cancel)
    await SessionOrchestrator(cfg).run()

# ...inside run():
finally:
    try:
        await self.massager.stop()
    except Exception as e:
        print(f"!! SOFTWARE STOP FAILED ({e}).")
        print("!! Turn the unit off with its power button or remove the pads.")
```

The real emergency stop is still the power button or pulling a pad. The software stop depends on Bluetooth working.

AI was genuinely useful for the grind: knowing jadx, recognizing Inuker BluetoothKit, and telling me which file to `cat` next. But it also stated guesses as facts. It gave me names and frequencies for all eight modes, current ranges per intensity level, and a battery and pad-fault format for the notifications. None of that came from the code. It also called my final script "production-grade" without catching that the hardware timer backstop had never been tested. Treat its confident details as hypotheses.

## What's next

- [ ] Test the hardware timer backstop with no pads attached: start a session, kill the script, confirm the unit shuts off on time
- [ ] Confirm that level 0 means no output, and that timer 0 doesn't mean "run forever"
- [ ] Log notification bytes next to each command I send and start decoding them
- [ ] Look up the real mode names in the app's resources
- [ ] Wrap the controller as a tool so Claude can start and adjust sessions

## Appendix: the full script

Here's the complete `fitrx_orchestrator.py`. The 7772 profile is untested; I only have the standard HRK-016B hardware.

```python
#!/usr/bin/env python3
"""
FitRx / HRK-016B session controller (BLE, macOS).

Runs ramp / hold / ramp-down / rest cycles using the unit's own mode presets
(1-8) and intensity levels (0-9), with the hardware timer set as a backstop.
Logs raw notification bytes from the device for study; it does not interpret
them, because the device's status format hasn't been confirmed yet.

The real emergency stop is the unit's power button or removing a pad.
The software stop below depends on Bluetooth working.
"""

import argparse
import asyncio
import signal
import sys
import time
from dataclasses import dataclass

from bleak import BleakClient, BleakScanner

# GATT UUIDs from the decompiled app
UUID_MAP = {
    "standard": {
        "service": "0000ae3a-0000-1000-8000-00805f9b34fb",
        "write": "0000ae3b-0000-1000-8000-00805f9b34fb",
        "notify": "0000ae3c-0000-1000-8000-00805f9b34fb",
    },
    # Untested: no hardware with this profile has been tried.
    "7772": {
        "service": "0000fff0-0000-1000-8000-00805f9b34fb",
        "write": "0000fff5-0000-1000-8000-00805f9b34fb",
        "notify": "0000fff4-0000-1000-8000-00805f9b34fb",
    },
}

TIMER_MIN, TIMER_MAX = 5, 40  # the unit's advertised timer range, in minutes


@dataclass
class SessionConfig:
    mode_preset: int = 1
    target_intensity: int = 4
    ramp_up_seconds: float = 5.0
    ramp_down_seconds: float = 2.0
    work_seconds: float = 10.0
    rest_seconds: float = 20.0
    total_minutes: int = 20


class FitRxMassager:
    def __init__(self):
        self.client = None
        self.device = None
        self.variant = "standard"
        self.write_uuid = None
        self.notify_uuid = None
        self._t0 = time.monotonic()

    def _notification_handler(self, sender, data: bytearray):
        """Log raw notification bytes with a timestamp. No interpretation."""
        t = time.monotonic() - self._t0
        print(f"[RX {t:8.2f}s] {data.hex(' ').upper()}")

    async def scan_and_connect(self):
        print("Searching for FitRx / HRK-016B...")
        devices = await BleakScanner.discover(timeout=7.0)

        for d in devices:
            name = (d.name or "").strip()
            if any(name.startswith(p) for p in ["HRK-016B", "FitRx Wireles", "FitRx 7772"]):
                self.device = d
                break

        if not self.device:
            raise RuntimeError("FitRx device not found. Make sure the unit is on and blinking.")

        print(f"Found {self.device.name} [{self.device.address}]")
        self.variant = "7772" if "7772" in self.device.name else "standard"
        if self.variant == "7772":
            print("Warning: the 7772 profile is untested.")
        self.write_uuid = UUID_MAP[self.variant]["write"]
        self.notify_uuid = UUID_MAP[self.variant]["notify"]

        self.client = BleakClient(self.device.address)
        await self.client.connect()
        print(f"Connected ({self.variant} profile).")

        await self.client.start_notify(self.notify_uuid, self._notification_handler)
        print("Logging notifications.")

    async def _send_payload(self, hex_string: str):
        if not self.client or not self.client.is_connected:
            raise ConnectionError("BLE client is not connected.")
        await self.client.write_gatt_char(self.write_uuid, bytes.fromhex(hex_string), response=False)
        await asyncio.sleep(0.08)

    async def set_mode(self, mode: int):
        mode = max(1, min(mode, 8))
        print(f"[TX] mode {mode}")
        if self.variant == "standard":
            await self._send_payload(f"ACAD06A1000000{mode:02d}BCBD")
        else:
            await self._send_payload(f"AT+CMODE=0,{mode:02d}\r\n".encode().hex())

    async def set_intensity(self, level: int):
        level = max(0, min(level, 9))
        print(f"[TX] level {level}")
        if self.variant == "standard":
            await self._send_payload(f"ACAD06A0000000{level:02d}BCBD")
        else:
            await self._send_payload(f"41542b435354523d312C{f'{level:X}'.encode().hex()}0D0A")

    async def set_timer(self, minutes: int):
        print(f"[TX] timer {minutes} min" if minutes else "[TX] timer off")
        if self.variant == "standard":
            if minutes == 0:
                await self._send_payload("ACAD06A200000000BCBD")
            else:
                await self._send_payload(f"ACAD06A2010100{minutes:02X}BCBD")
        else:
            if minutes == 0:
                await self._send_payload("41542B4344434C4B3D3030303030300A0D0A")
            else:
                await self._send_payload(f"41542B4344434C4B3D3030{f'{minutes:02d}'.encode().hex()}30300D0A")

    async def stop(self):
        print("[Software stop] Setting level 0 and clearing timer...")
        await self.set_intensity(0)
        await self.set_timer(0)

    async def disconnect(self):
        if self.client and self.client.is_connected:
            try:
                await self.client.stop_notify(self.notify_uuid)
            except Exception:
                pass
            await self.client.disconnect()
            print("Disconnected.")


class SessionOrchestrator:
    def __init__(self, config: SessionConfig):
        self.cfg = config
        self.massager = FitRxMassager()

    async def _ramp(self, start_lvl: int, end_lvl: int, duration_sec: float):
        steps = abs(end_lvl - start_lvl)
        if steps == 0 or duration_sec <= 0:
            await self.massager.set_intensity(end_lvl)
            return
        interval = duration_sec / steps
        direction = 1 if end_lvl > start_lvl else -1
        current = start_lvl
        for _ in range(steps):
            current += direction
            await self.massager.set_intensity(current)
            await asyncio.sleep(interval)

    async def run(self):
        c = self.cfg
        try:
            await self.massager.scan_and_connect()

            # Hardware timer first, so the unit shuts itself off even if this script dies.
            await self.massager.set_timer(c.total_minutes)
            await self.massager.set_mode(c.mode_preset)
            await self.massager.set_intensity(0)

            print("\nSession:")
            print(f"  Duration     : {c.total_minutes} min (hardware timer set)")
            print(f"  Mode preset  : {c.mode_preset}")
            print(f"  Peak level   : {c.target_intensity} of 9")
            print(f"  Work / rest  : {c.work_seconds}s / {c.rest_seconds}s")
            print(f"  Ramp up/down : {c.ramp_up_seconds}s / {c.ramp_down_seconds}s")
            print("  Ctrl+C to stop. Power button or removing a pad is the real emergency stop.\n")

            total_seconds = c.total_minutes * 60
            elapsed = 0.0
            cycle = 1
            while elapsed < total_seconds:
                print(f"[Cycle {cycle}] Ramp up 0 -> {c.target_intensity} over {c.ramp_up_seconds}s")
                await self._ramp(0, c.target_intensity, c.ramp_up_seconds)
                elapsed += c.ramp_up_seconds

                print(f"[Cycle {cycle}] Hold level {c.target_intensity} for {c.work_seconds}s")
                await asyncio.sleep(c.work_seconds)
                elapsed += c.work_seconds

                print(f"[Cycle {cycle}] Ramp down {c.target_intensity} -> 0 over {c.ramp_down_seconds}s")
                await self._ramp(c.target_intensity, 0, c.ramp_down_seconds)
                elapsed += c.ramp_down_seconds

                if elapsed >= total_seconds:
                    break

                print(f"[Cycle {cycle}] Rest at level 0 for {c.rest_seconds}s\n")
                await asyncio.sleep(c.rest_seconds)
                elapsed += c.rest_seconds
                cycle += 1

            print("\nSession complete.")
        except asyncio.CancelledError:
            print("\nInterrupted.")
        except Exception as e:
            print(f"\nError: {e}")
        finally:
            try:
                await self.massager.stop()
            except Exception as e:
                print(f"\n!! SOFTWARE STOP FAILED ({e}).")
                print("!! Turn the unit off with its power button or remove the pads.")
            try:
                await self.massager.disconnect()
            except Exception:
                pass


def parse_args() -> SessionConfig:
    p = argparse.ArgumentParser(description="FitRx BLE session runner with ramps and duty cycles")
    p.add_argument("--mode", type=int, default=1, choices=range(1, 9),
                   help="Hardware mode preset 1-8 (default: 1)")
    p.add_argument("--target-intensity", type=int, default=4, choices=range(1, 10),
                   help="Peak level 1-9 (default: 4)")
    p.add_argument("--duty-cycle", nargs=2, type=float, metavar=("WORK", "REST"), default=[10.0, 20.0],
                   help="Hold and rest times in seconds (default: 10 20)")
    p.add_argument("--ramp", type=float, default=5.0, help="Ramp-up seconds (default: 5)")
    p.add_argument("--ramp-down", type=float, default=2.0, help="Ramp-down seconds (default: 2)")
    p.add_argument("--timer", type=int, default=20, choices=range(TIMER_MIN, TIMER_MAX + 1),
                   metavar=f"{TIMER_MIN}-{TIMER_MAX}",
                   help=f"Session length in minutes, {TIMER_MIN}-{TIMER_MAX} (default: 20)")
    a = p.parse_args()

    work, rest = a.duty_cycle
    if work <= 0 or rest < 0 or a.ramp < 0 or a.ramp_down < 0:
        p.error("work time must be positive; rest and ramp times can't be negative")

    return SessionConfig(
        mode_preset=a.mode,
        target_intensity=a.target_intensity,
        ramp_up_seconds=a.ramp,
        ramp_down_seconds=a.ramp_down,
        work_seconds=work,
        rest_seconds=rest,
        total_minutes=a.timer,
    )


async def main(cfg: SessionConfig):
    # Turn Ctrl+C into a task cancellation so the stop in `finally` always gets
    # sent, on every Python version, instead of the loop being torn down first.
    task = asyncio.current_task()
    asyncio.get_running_loop().add_signal_handler(signal.SIGINT, task.cancel)
    await SessionOrchestrator(cfg).run()


if __name__ == "__main__":
    cfg = parse_args()
    try:
        asyncio.run(main(cfg))
    except KeyboardInterrupt:
        print("\nAborted. If the unit is still running, use its power button.")
        sys.exit(1)
```
