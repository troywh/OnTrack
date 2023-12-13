let initialURLs = {
  education: [
    "https://www.ixl.com/",
    "https://www.khanacademy.org/",
    "https://www.lexiacore5.com/",
    "https://www.login.i-ready.com",
    "https://play.stmath.com",
    "https://www.odysseyk12.remote-learner.net",
    "https://mail.google.com/mail/u/o/",
  ],
  entertainment: [
    "https://www.youtube.com/",
    "https://www.netflix.com/",
    "https://www.roblox.com/",
    "https://www.minecraft.net/en-us",
    "https://discord.com/",
    "https://www.tiktok.com/en/",
  ],
}

let initialData = {
  EDUCATION: {},

  ENTERTAINMENT: {},

  OTHER: {}
}

//Save LogDdata to LocalStorage
const saveData = async (jsonData) => {
  try {
    await chrome.storage.sync.set({ "history": JSON.stringify(jsonData) });
    console.log('Data has been saved');
  } catch (error) {
    console.log("Error corrupted: ", error);
  }
}

//Get LogData from LocalStorage
const getData = async () => {
  try {
    let result = await chrome.storage.sync.get(["history"]);
    let parsedJSON = JSON.parse(result.history);
    if (Object.keys(parsedJSON).length === 0) return initialData;
    else return parsedJSON;
  } catch (error) {
    console.log("Error corrupted: ", error);
  }
}
const getDateString = () => {
  let dateString = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
  return dateString;
}

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed');
  // Initialize any required state or databases here
  await saveData(initialData);
});

chrome.tabs.onActivated.addListener(activeInfo => {
  console.log("tabs actived!");
  // Track the active tab and update activity log
  updateActivityLog(activeInfo.tabId);

});

function categorizeWebsite(url) {

  let category = "OTHER";
  initialURLs.education.map(eduUrl => {
    if (url.includes(eduUrl)) category = "EDUCATION";
  });
  initialURLs.entertainment.map(eduUrl => {
    if (url.includes(eduUrl)) category = "ENTERTAINMENT";
  });
  return category;
}

//Declear LogInteval, activity
let logInteval;
let activity;

function updateActivityLog(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    if (tab.url) {
      // Log the tab URL and timestamp

      activity = {
        url: tab.url,
        timestamp: new Date().getTime(),
        category: categorizeWebsite(tab.url)
      };

      clearInterval(logInteval);
      console.log('logInterval START');
      logInteval = setInterval(() => {
        logActivity(activity);
      }, 10000);
    }
  });
}

const logActivity = async (activity) => {
  console.log(activity);
  try {
    let prevData = await getData();
    let dateString = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
    let categoryObj = prevData[activity.category];
    if (Object.keys(categoryObj).includes(dateString)) categoryObj[dateString] += 0.1;
    else categoryObj[dateString] = 0.1;
    await saveData(prevData);
  } catch (error) {
    console.log("Error corrupted: ", error);
  }
}

// Placeholder for the actual implementation
function initExtension() {
}

// Placeholder for the actual implementation
function trackTabActivity() {
}

chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    //Retrieve the values from the message object
    const fromEmail = message.fromEmail;
    const toEmail = message.toEmail;
    const password = message.password;

    saveSendData(fromEmail, toEmail, password);
    //Send a response back to the content script if needed
    sendResponse("Message received!");
  }
)

const saveSendData = async (fromEmail, toEmail, password) => {

  const settingdate = { "fromEmail": fromEmail, "toEmail": toEmail, "password": password };
  await saveDataE(settingdate);
  console.log("SendDate saved successfully!");

}

const saveDataE = async (settingdate) => {
  try {
    await chrome.storage.sync.set({ "Apply": JSON.stringify(settingdate) });
    console.log('SettingData has been saved');
  } catch (error) {
    console.log("Error corrupted: ", error);
  }
}

const getDataE = async () => {
  try {
    let result = await chrome.storage.sync.get(["Apply"]);
    let parsedJSON = JSON.parse(result.Apply);
    return parsedJSON;
  } catch (error) {
    console.log("Error corrupted: ", error);
  }
}

let currentTime;

setInterval(async () => {
  currentTime = new Date().toLocaleTimeString();
  if (currentTime === "9:00:00 PM") {

    const elements = await getDataE();
    fEmail = elements.fromEmail;
    tEmail = elements.toEmail;
    pword = elements.password;
    const SendData = await getData();
    const formattedData = {};

    if (SendData) {
      for (const [category, values] of Object.entries(SendData)) {
        if (values && Object.keys(values).length !== 0) {
          const [date, duration] = Object.entries(values)[0];
          let hours = Math.floor(duration.toFixed(1) / 60);
          let minutes = Math.floor(duration.toFixed(1) % 60);
          const formattedDuration = `  ${hours} h  :  ${minutes} min `;
          formattedData[category] = `  ${date}  :  ${formattedDuration}  `;
        } else {
          formattedData[category] = "  Nothing activity!  ";
        }
      }
    }

    sendEmailAutomate(fEmail, tEmail, pword, formattedData);

  }
}, 1000);

const sendEmailAutomate = async (fromEmail, toEmail, password, formattedData) => {
  console.log('OHG Genius!');

  try {
    let response = await fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedData,
        fromEmail: fromEmail,
        toEmail: toEmail,
        password: password
      }),
    });
  } catch (err) {
    console.log(err);
  }
};