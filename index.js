const { Telegraf, Markup } = require("telegraf")
const fs = require("fs")

const bot = new Telegraf("7654511200:AAFguCAbypsNMZq8rJLdAAJJbhUw4xILneQ")

const CHANNEL = "@izzy_design"
const ADMIN_ID = 5056923540

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

// ===== START =====

bot.start(async (ctx) => {
    const userId = ctx.from.id

    // ❗ pastdagi keyboardni olib tashlaydi
    await ctx.reply("🔄 Bot qayta ishga tushdi", {
        reply_markup: { remove_keyboard: true }
    })

    try {
        const member = await ctx.telegram.getChatMember(CHANNEL, userId)

        if (member.status === "left") {
            return ctx.reply(
                "🚫 Signal olish uchun yopiq kanalimizga a’zo bo‘ling!\n\nKanalga kirib bo‘lgach, “✅ Obunani tekshirish” tugmasini bosing.",
                Markup.inlineKeyboard([
                    [Markup.button.url("📢 Kanalga kirish", `https://t.me/${CHANNEL.replace("@","")}`)],
                    [Markup.button.callback("✅ Tekshirish", "check_sub")]
                ])
            )
        }

        sendMenu(ctx)

    } catch (err) {
        console.log(err)
    }
})


// ===== OBUNA TEKSHIRISH =====

bot.action("check_sub", async (ctx) => {
    const member = await ctx.telegram.getChatMember(CHANNEL, ctx.from.id)

    if (member.status !== "left") {
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
        {
            type: "photo",
            media: { source: img1 },
            caption:
`✨ ${name}
━━━━━━━━━━━━━━
🎁 PROMOKOD: ${promo}
💰 Min depozit: 10 000 so‘m

📸 2 ta rasm yuboring`
        },
        {
            type: "photo",
            media: { source: img2 }
        }
    ])

    await ctx.reply(
        "👇 Ro‘yxatdan o‘tish:",
        Markup.inlineKeyboard([
            [Markup.button.url("🔗 Kirish", link)]
        ])
    )
}

// ===== VARIANTLAR =====

bot.action("v1", ctx =>
    sendVariant(ctx,"✨ 1xbet — Apple Of Fortune uchun signal olish:","ZEGA77",
    "https://t.me/ZEGABONUS/8",
    "1xbet1.png","1xbet2.png")
)

bot.action("v2", ctx =>
    sendVariant(ctx,"✨ Linebet — Apple Of Fortune uchun signal olish:","ZEGA",
    "https://t.me/ZEGABONUS/6",
    "linebet1.png","linebet2.png")
)

bot.action("v3", ctx =>
    sendVariant(ctx,"✨ Melbet — Apple Of Fortune uchun signal olish:","ZEGA77",
    "https://t.me/ZEGABONUS/18",
    "melbet1.png","melbet2.png")
)

bot.action("v4", ctx =>
    sendVariant(ctx,"✨ Dbbet — Apple Of Fortune uchun signal olish:","ZEGA",
    "https://t.me/ZEGABONUS/19",
    "dbbet1.png","dbbet2.png")
)

// ===== USER RASM YUBORISH =====

bot.on("photo", async (ctx)=>{
    const userId = ctx.from.id
    if(!users[userId]) return

    users[userId].photos.push(ctx.message.photo.pop().file_id)

    if(users[userId].photos.length === 2){

        await ctx.reply("✅ Rasm qabul qilindi!\n⏳ Tekshiruv 5 daqiqadan 24 soatgacha davom etadi.\n\n❗️ Botni bloklamang, aks holda signal ololmaysiz!")

        await bot.telegram.sendPhoto(
            ADMIN_ID,
            users[userId].photos[0],
            {
                caption: `User ID: ${userId}`,
                reply_markup:{
                    inline_keyboard:[[
                        {text:"✅ Tasdiqlash", callback_data:`approve_${userId}`},
                        {text:"❌ Rad", callback_data:`reject_${userId}`}
                    ]]
                }
            }
        )

        await bot.telegram.sendPhoto(ADMIN_ID, users[userId].photos[1])
    }

    saveUsers()
})

// ===== ADMIN TASDIQLASH =====

bot.action(/approve_(.+)/, async (ctx) => {
    const userId = ctx.match[1]

    users[userId].approved = true
    saveUsers()

    // foydalanuvchiga
    await bot.telegram.sendMessage(
        userId,
        "✅ Tasdiqlandingiz!",
        Markup.keyboard([["📊 Signal olish"]]).resize()
    )

    // admin oynasida ko‘rsatadi
    await ctx.editMessageText(`✅ Foydalanuvchi tasdiqlandi:\nID: ${userId}`)

    ctx.answerCbQuery("Tasdiqlandi")
})

// ===== ADMIN RAD =====

bot.action(/reject_(.+)/, async (ctx) => {
    const userId = ctx.match[1]

    delete users[userId]
    saveUsers()

    // foydalanuvchiga
    await bot.telegram.sendMessage(
        userId,
        "❌ Rad etildi",
        { reply_markup: { remove_keyboard: true } }
    )

    // admin oynasida ko‘rsatadi
    await ctx.editMessageText(`❌ Foydalanuvchi rad qilindi:\nID: ${userId}`)

    ctx.answerCbQuery("Rad etildi")
})

// ===== SIGNAL =====

bot.hears("📊 Signal olish", async (ctx)=>{
    const userId = ctx.from.id

    if(!users[userId] || !users[userId].approved){
        return ctx.reply("❗ Avval tasdiqlanish kerak")
    }

    users[userId].lastSignal = Date.now()
    saveUsers()

    const random = signals[Math.floor(Math.random()*signals.length)]

    await ctx.replyWithPhoto(
        { source: random.photo },
        { caption: random.text }
    )
})

// ===== ERROR ushlash =====

bot.catch(err => console.log("Xatolik:", err))

bot.launch()
console.log("Bot ishga tushdi 🚀")
