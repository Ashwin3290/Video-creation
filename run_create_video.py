#!/usr/bin/env python3
import pexpect
import sys
import time

child = pexpect.spawn('npx create-video@latest --hello-world my-video', encoding='utf-8', timeout=120)
child.logfile = sys.stdout

try:
    # Handle "inside git repo" prompt - default is "No", toggle to "Yes"
    index = child.expect([
        'Do you want to continue',
        pexpect.EOF,
        pexpect.TIMEOUT
    ], timeout=30)

    if index == 0:
        time.sleep(0.3)
        child.send('\x1b[C')  # right arrow to toggle to Yes
        time.sleep(0.3)
        child.send('\r')

    # Handle "Add TailwindCSS?" prompt - default is "Yes", toggle to "No"
    index2 = child.expect([
        'Add TailwindCSS',
        pexpect.EOF,
        pexpect.TIMEOUT
    ], timeout=30)

    if index2 == 0:
        time.sleep(0.3)
        child.send('\x1b[D')  # left arrow to toggle to No
        time.sleep(0.3)
        child.send('\r')

    # Handle "Add agent skills?" prompt - default is "Yes", toggle to "No"
    index3 = child.expect([
        'Add agent skills',
        'Copied to',
        pexpect.EOF,
        pexpect.TIMEOUT
    ], timeout=30)

    if index3 == 0:
        time.sleep(0.3)
        child.send('\x1b[D')  # left arrow to toggle to No
        time.sleep(0.3)
        child.send('\r')

    child.expect(pexpect.EOF, timeout=120)

except Exception as e:
    print(f"\nError: {e}")

print(f"\nExit code: {child.exitstatus}")
