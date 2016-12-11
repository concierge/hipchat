## Hipchat Integration
#### Installation
The easiest way to install this integration is to use KPM.
```sh
/kpm install hipchat
```

#### Configuration
To add a configuration, execute each of the following commands (replace each of the angle bracketed strings with the respective information from [https://uclive.hipchat.com/account/xmpp](https://uclive.hipchat.com/account/xmpp)):
```sh
/kpm config hipchat xmppJid "<jabberID, excluding @domain. e.g. 123@hipchat.com => 123>"
/kpm config hipchat roomNickname "<roomNickname>"
/kpm config hipchat password "<accountPassword>"
/kpm config hipchat roomJids ["<XMPP/JabberName of room>",...]
```

###### Optional Parameters
For more advanced configuration the following parameters are also avalible:

*Set Hipchat Servers*
Use this to enable working with private Hipchat servers.
```sh
/kpm config hipchat connectHost "<host, e.g. chat.hipchat.com>"
/kpm config hipchat conferenceDomain "<domain, e.g. conf.hipchat.com>"
```

*Set Command Prefix*
```sh
/kpm config hipchat commandPrefix "/"
```

#### Running
To run Hipchat, either run `node main.js hipchat` when starting Concierge or run `/kpm start hipchat` when Concierge is running.
