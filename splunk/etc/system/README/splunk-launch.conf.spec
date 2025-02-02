#   Version 7.3.1

# splunk-launch.conf contains values used at startup time, by the splunk
# command and by windows services.
#

# Note: this conf file is different from most splunk conf files.  There is
# only one in the whole system, located at
# $SPLUNK_HOME/etc/splunk-launch.conf; further, there are no stanzas,
# explicit or implicit.  Finally, any splunk-launch.conf files in
# etc/apps/... or etc/users/... will be ignored.


# Lines beginning with a # are considered comments and are ignored.

#*******
# Environment variables
#
# Primarily, this file simply sets environment variables to be used by
# Splunk programs.
#
# These environment variables are the same type of system environment
# variables that can be set, on unix, using:
#   bourne shells:
#       $ export ENV_VAR=value
#   c-shells:
#       % setenv ENV_VAR value
#
# or at a windows command prompt:
#   C:\> SET ENV_VAR=value
#*******

<environment_variable>=<value>

* Any desired environment variable can be set to any value.
  Whitespace is trimmed from around both the key and value.
* Environment variables set here will be available to all splunk processes,
  barring operating system limitations.


#*******
# Specific Splunk environment settings
#
# These settings are primarily treated as environment variables, though some
# have some additional logic (defaulting).
#
# There is no need to explicitly set any of these values in typical
# environments.
#*******

SPLUNK_HOME=<pathname>
* The comment in the auto-generated splunk-launch.conf is informational, not
  a live setting, and does not need to be uncommented.
* Fully qualified path to the Splunk install directory.
* If unset, Splunk automatically determines the location of SPLUNK_HOME
  based on the location of the splunk CLI executable.
    * Specifically, the parent of the directory containing splunk or splunk.exe
* Must be set if Common Criteria mode is enabled.
* NOTE: Splunk plans to submit Splunk Enterprise for Common Criteria
  evaluation. Splunk does not support using the product in Common
  Criteria mode until it has been certified by NIAP. See the "Securing
  Splunk Enterprise" manual for information on the status of Common
  Criteria certification.
* Defaults to unset.

SPLUNK_DB=<pathname>
* The comment in the auto-generated splunk-launch.conf is informational, not
  a live setting, and does not need to be uncommented.
* Fully qualified path to the directory containing the splunk index
  directories.
* Primarily used by paths expressed in indexes.conf
* The comment in the autogenerated splunk-launch.conf is informational, not
  a live setting, and does not need to be uncommented.
* If unset, becomes $SPLUNK_HOME/var/lib/splunk (unix) or
     %SPLUNK_HOME%\var\lib\splunk (windows)
* Defaults to unset.

SPLUNK_BINDIP=<ip address>
* Specifies an interface that splunkd and splunkweb should bind to, as
  opposed to binding to the default for the local operating system.
* If unset, Splunk makes no specific request to the operating system when
  binding to ports/opening a listening socket.  This means it effectively
  binds to '*'; i.e.  an unspecified bind.  The exact result of this is
  controlled by operating system behavior and configuration.
* NOTE: When using this setting you must update mgmtHostPort in web.conf to
  match, or the command line and splunkweb will not know how to
  reach splunkd.
* For splunkd, this sets both the management port and the receiving ports
  (from forwarders).
* Useful for a host with multiple IP addresses, either to enable
  access or restrict access; though firewalling is typically a superior
  method of restriction.
* Overrides the Splunkweb-specific web.conf/[settings]/server.socket_host
  param; the latter is preferred when SplunkWeb behavior is the focus.
* Defaults to unset. 

SPLUNK_IGNORE_SELINUX=true
* If unset (not present), Splunk on Linux will abort startup if it detects
  it is running in an SELinux environment.  This is because in
  shipping/distribution-provided SELinux environments, Splunk will not be
  permitted to work, and Splunk will not be able to identify clearly why.
* This setting is useful in environments where you have configured SELinux
  to enable Splunk to work.
* If set to any value, Splunk will launch, despite the presence of SELinux.
* Defaults to unset.

SPLUNK_OS_USER = <string> | <nonnegative integer>
* The OS user whose privileges Splunk will adopt when running, if this
  parameter is set.
* Example: SPLUNK_OS_USER=fnietzsche, but a root login is used to start
  splunkd. Immediately upon starting, splunkd abandons root's privileges,
  and acquires fnietzsche's privileges; any files created by splunkd (index
  data, logs, etc.) will be consequently owned by fnietzsche.  So when
  splunkd is started next time by fnietzsche, files will be readable.
* When 'splunk enable boot-start -user <U>' is invoked, SPLUNK_OS_USER
  is set to <U> as a side effect.
* Under UNIX, username or apposite numeric UID are both acceptable;
  under Windows, only a username.

#*******
# Service/server names.
#
# These settings are considered internal, and altering them is not
# supported.
#
# Under Windows, they influence the expected name of the service;
# on UNIX they influence the reported name of the appropriate 
# server or daemon process.
#
# On Linux distributions that run systemd, this is the name of the
# unit file for the service that Splunk Enterprise runs as.
# For example, if you set 'SPLUNK_SERVER_NAME' to 'splunk'
# then the corresponding unit file should be named 'splunk.service'.
#
# If you want to run multiple instances of Splunk as *services* under
# Windows, you will need to change the names below for 2nd, 3rd, ...,
# instances.  That is because the 1st instance has taken up service names
# 'Splunkd' and 'Splunkweb', and you may not have multiple services with
# same name.
#*******

SPLUNK_SERVER_NAME=<name>
* Names the splunkd server/service.
* Defaults to splunkd (UNIX), or Splunkd (Windows).

SPLUNK_WEB_NAME=<name>
* Names the Python app server / web server/service.
* Defaults to splunkweb (UNIX), or Splunkweb (Windows).

#*******
# File system check enable/disable
#
# CAUTION !!! CAUTION !!! CAUTION !!! CAUTION !!! CAUTION !!! CAUTION !!!
# USE OF THIS ADVANCED SETTING IS NOT SUPPORTED. IRREVOCABLE DATA LOSS 
# CAN OCCUR. YOU USE THE SETTING SOLELY AT YOUR OWN RISK.
# CAUTION !!! CAUTION !!! CAUTION !!! CAUTION !!! CAUTION !!! CAUTION !!!
#
# When Splunk software encounters a file system that it does not recognize,
# it runs a utility called 'locktest' to confirm that it can write to the
# file system correctly. If 'locktest' fails for any reason, splunkd
# cannot start.
#
# The following setting lets you temporarily bypass the 'locktest'  
# check (for example, when a software vendor introduces a new default
# file system on a popular operating system.) When it is active, splunkd
# starts regardless of its ability to interact with the file system.
#
# Use this setting if and only if:
#
# * You are a skilled Splunk administrator and know what you are doing.
# * You use Splunk software in a development environment.
# * You want to recover from a situation where the default
#   filesystem has been changed outside of your control (such as 
#   during an operating system upgrade.)
# * You want to recover from a situation where a Splunk bug
#   has invalidated a previously functional file system after an upgrade.
# * You want to evaluate the performance of a file system for which
#   Splunk has not yet offered support. 
# * You have been given explicit instruction from Splunk Support to use
#   the setting to solve a problem where Splunk software does not start
#   because of a failed file system check.
# * You understand and accept all of the risks of using the setting, 
#   up to and including LOSING ALL YOUR DATA WITH NO CHANCE OF RECOVERY
*   while the setting is active.
#
# If none of these scenarios applies to you, then DO NOT USE THE SETTING.
#
# REPEAT:
# USE OF THIS ADVANCED SETTING IS NOT SUPPORTED. IRREVOCABLE DATA LOSS
# CAN OCCUR. YOU USE THIS SETTING SOLELY AT YOUR OWN RISK. BY USING THE
# SETTING, YOU ARE ACTIVELY BYPASSING FILE SYSTEM CHECKS THAT ARE
# DESIGNED TO CONFIRM THAT SPLUNK SOFTWARE CAN WORK ON YOUR MACHINE
# FILE SYSTEM. DO NOT USE THE SETTING AS A LONG-TERM SOLUTION TO A FILE
# SYSTEM PROBLEM. WHEN USING THE SETTING UNDER GUIDANCE OF SPLUNK
# SUPPORT, REPORT ANY PROBLEMS YOU ENCOUNTER WITH INDEXING OR
# SEARCH IMMEDIATELY.
#
#*******

OPTIMISTIC_ABOUT_FILE_LOCKING = [0|1]
* Whether or not Splunk software skips the file system lock check on 
  unrecognized file systems.
* CAUTION: USE THIS SETTING AT YOUR OWN RISK. YOU CAN LOSE ANY DATA
  THAT HAS BEEN INDEXED AS LONG AS THE SETTING IS ACTIVE.
* When set to 1, Splunk software skips the file system check, and
  splunkd starts whether or not it can recognize the file system.
* Defaults to 0 (Run the file system check.)
