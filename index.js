const getSteamUser = require('get-steam-user')
const steamid = require('steamid');
const { Select, Confirm } = require('enquirer');
const copydir = require('copy-dir')

getSteamUser.getUserInfo(async (infos) => {
    const usersInfos = infos.map((user, index) => {
        const sid = new steamid(user.steamid);
        user.accountid = sid.accountid;
        return user;
    })
    

    const sourceAccountPrompt = new Select({
        name: 'sourceAccount',
        message: 'Select source account for CS:GO cfg',
        choices: usersInfos.map((userInfo) => userInfo.username)
    })

    const selectedSourceAccountName = await sourceAccountPrompt.run();
    const selectedSourceAccount = usersInfos.find((userInfo) => userInfo.username === selectedSourceAccountName);

    const targetAccountPrompt = new Select({
        name: 'targetAccount',
        message: 'Select target account for CS:GO cfg',
        choices: usersInfos.filter((userInfo) => userInfo.username !== selectedSourceAccountName).map((userInfo) => userInfo.username)
    })

    const selectedTargetAccountName = await targetAccountPrompt.run()
    const selectedTargetAccount = usersInfos.find((userInfo) => userInfo.username === selectedTargetAccountName);

    const confirmationPrompt = new Confirm({
        name: 'question',
        message: `Are you sure you want to copy ${selectedSourceAccountName}'s config to ${selectedTargetAccountName} ?`
    });

    await confirmationPrompt.run() ? copyConfig(selectedSourceAccount.accountid, selectedTargetAccount.accountid) : console.log('ntm fdp')
});

const copyConfig = async (source, target) => {
    const userDataFolder = "C:/Program Files (x86)/Steam/userdata/"
    const sourceFolder = userDataFolder + source + '/730';
    const targetFolder = userDataFolder + target + '/730';
    try {
        copydir(sourceFolder, targetFolder, {
            utimes: true,  // keep add time and modify time
            mode: true,    // keep file mode
            cover: true    // cover file when exists, default is true
        })
    } catch (error) {
        console.error(error)
    }
};
