const { Telegraf, Markup } = require("telegraf")
const fs = require("fs")

const bot = new Telegraf("7654511200:AAFguCAbypsNMZq8rJLdAAJJbhUw4xILneQ")
const ADMIN_ID = 8162902542

// ===== CHANNELS =====
if (!fs.existsSync("channels.json")) fs.writeFileSync("channels.json","[]")

function getChannels(){
    return JSON.parse(fs.readFileSync("channels.json"))
}

// ===== USER BAZA =====
let users = {}

if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"))
}

function saveUsers() {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2))
}

// ===== SIGNAL RASMLAR =====
const signals = [
    { photo: "olma1.png", text: "📡Signal: Ko'rsatilgan qatorni tanlang!\n__________________________\n🤖 Diqqat e'tiborli bo'ling!\nBizning APK dan foydalanmasangiz, ushbu signal sizda ishlamaydi ⚠️\n\n📱 Bizning APK kanal:\n@ZEGA_BET" },
    { photo: "olma2.png", text: "📡Signal: Ko'rsatilgan qatorni tanlang!\n__________________________\n🤖 Diqqat e'tiborli bo'ling!\nBizning APK dan foydalanmasangiz, ushbu signal sizda ishlamaydi ⚠️\n\n📱 Bizning APK kanal:\n@ZEGA_BET" },
    { photo: "olma3.png", text: "📡Signal: Ko'rsatilgan qatorni tanlang!\n__________________________\n🤖 Diqqat e'tiborli bo'ling!\nBizning APK dan foydalanmasangiz, ushbu signal sizda ishlamaydi ⚠️\n\n📱 Bizning APK kanal:\n@ZEGA_BET" },
    { photo: "olma4.png", text: "📡Signal: Ko'rsatilgan qatorni tanlang!\n__________________________\n🤖 Diqqat e'tiborli bo'ling!\nBizning APK dan foydalanmasangiz, ushbu signal sizda ishlamaydi ⚠️\n\n📱 Bizning APK kanal:\n@ZEGA_BET" },
    { photo: "olma5.png", text: "📡Signal: Ko'rsatilgan qatorni tanlang!\n__________________________\n🤖 Diqqat e'tiborli bo'ling!\nBizning APK dan foydalanmasangiz, ushbu signal sizda ishlamaydi ⚠️\n\n📱 Bizning APK kanal:\n@ZEGA_BET" }
]

// ===== STATS (ADMIN) =====
bot.command("stats", (ctx)=>{
    if(ctx.from.id !== ADMIN_ID) return
    ctx.reply(`👥 Foydalanuvchilar: ${Object.keys(users).length}`)
})

// ===== OBUNA TEKSHIRISH =====
async function checkSubscription(userId){
    const channels = getChannels()

    for (let ch of channels){
        try{
            const member = await bot.telegram.getChatMember(ch, userId)
            if(member.status === "left") return false
        }catch{
            return false
        }
    }
    return true
}

// ===== START =====
bot.start(async (ctx) => {
    const userId = ctx.from.id

    await ctx.reply("🔄 Bot qayta ishga tushdi", {
        reply_markup: { remove_keyboard: true }
    })

    if (!(await checkSubscription(userId))) {
        const channels = getChannels()

        return ctx.reply(
            "🚫 Signal olish uchun kanallarga a’zo bo‘ling!",
            Markup.inlineKeyboard([
                ...channels.map(ch => [Markup.button.url("📢 Kanal", `https://t.me/${ch.replace("@","")}`)]),
                [Markup.button.callback("✅ Tekshirish", "check_sub")]
            ])
        )
    }

    sendMenu(ctx)
})

// check button
bot.action("check_sub", async (ctx) => {
    if (await checkSubscription(ctx.from.id)) {
        await ctx.deleteMessage()
        sendMenu(ctx)
    } else {
        ctx.answerCbQuery("Avval obuna bo‘ling!")
    }
})

// ===== MENU =====
function sendMenu(ctx) {
    ctx.reply(
        "✅ Obuna tasdiqlandi!\n\nQuyidagi kantoradan birini tanlang:",
        Markup.inlineKeyboard([
            [Markup.button.callback("🔵 1XBET", "v1"),
             Markup.button.callback("🟢 LINEBET", "v2")],
            [Markup.button.callback("🟡 MELBET", "v3"),
             Markup.button.callback("🔴 DBBET", "v4")]
        ])
    )
}

// ===== VARIANT =====
async function sendVariant(ctx, name, promo, link, img1, img2) {
    const userId = ctx.from.id

    users[userId] = {
        approved: false,
        photos: [],
        lastSignal: 0
    }
    saveUsers()

    await ctx.replyWithMediaGroup([
        { type: "photo", media: { source: img1 },
          caption:`✨ ${name}\n━━━━━━━━━━━━━━\n🎁 PROMOKOD: ${promo}\n💰 Min depozit: 10 000 so‘m\n\n📸 2 ta rasm yuboring`
        },
        { type: "photo", media: { source: img2 } }
    ])

    await ctx.reply(
        "👇 Ro‘yxatdan o‘tish:",
        Markup.inlineKeyboard([[Markup.button.url("🔗 Kirish", link)]])
    )
}

bot.action("v1", ctx => sendVariant(ctx,"✨ 1xbet — Apple Of Fortune uchun signal olish:","ZEGA77","https://t.me/ZEGABONUS/8","1xbet1.png","1xbet2.png"))
bot.action("v2", ctx => sendVariant(ctx,"✨ Linebet — Apple Of Fortune uchun signal olish:","ZEGA","https://t.me/ZEGABONUS/6","linebet1.png","linebet2.png"))
bot.action("v3", ctx => sendVariant(ctx,"✨ Melbet — Apple Of Fortune uchun signal olish:","ZEGA77","https://t.me/ZEGABONUS/18","melbet1.png","melbet2.png"))
bot.action("v4", ctx => sendVariant(ctx,"✨ Dbbet — Apple Of Fortune uchun signal olish:","ZEGA","https://t.me/ZEGABONUS/19","dbbet1.png","dbbet2.png"))

// ===== USER RASM =====
bot.on("photo", async (ctx)=>{
    const userId = ctx.from.id
    if(!users[userId]) return

    users[userId].photos.push(ctx.message.photo.pop().file_id)

    if(users[userId].photos.length === 2){
        await ctx.reply("✅ Rasm qabul qilindi!\n⏳ Tekshiruv 5 daqiqadan 24 soatgacha davom etadi.")

        await bot.telegram.sendPhoto(ADMIN_ID, users[userId].photos[0], {
            caption: `User ID: ${userId}`,
            reply_markup:{
                inline_keyboard:[[
                    {text:"✅ Tasdiqlash", callback_data:`approve_${userId}`},
                    {text:"❌ Rad", callback_data:`reject_${userId}`}
                ]]
            }
        })

        await bot.telegram.sendPhoto(ADMIN_ID, users[userId].photos[1])
    }

    saveUsers()
})

// approve
bot.action(/approve_(.+)/, async (ctx) => {
    const userId = ctx.match[1]
    users[userId].approved = true
    saveUsers()

    await bot.telegram.sendMessage(userId,"✅ Tasdiqlandingiz!",Markup.keyboard([["📊 Signal olish"]]).resize())
})

// reject
bot.action(/reject_(.+)/, async (ctx) => {
    const userId = ctx.match[1]
    delete users[userId]
    saveUsers()

    await bot.telegram.sendMessage(userId,"❌ Rad etildi",{ reply_markup:{ remove_keyboard:true } })
})

// ===== SIGNAL =====
bot.hears(/Signal olish/, async (ctx)=>{
    const userId = ctx.from.id

    if(!users[userId] || !users[userId].approved){
        return ctx.reply("❗ Avval tasdiqlanish kerak")
    }

    const random = signals[Math.floor(Math.random()*signals.length)]
    await ctx.replyWithPhoto({ source: random.photo }, { caption: random.text })
})

// ===== START BOT =====
bot.catch(err => console.log("Xatolik:", err))
bot.launch()
console.log("Bot ishga tushdi 🚀")

