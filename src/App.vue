<template>
  <div class="min-h-screen bg-base text-ink font-sans">
    <!-- Header -->
    <div class="relative">
      <img
        src="/header.png"
        alt="Okinawa"
        class="w-full h-56 object-cover rounded-b-[2rem]"
      />

      <!-- Floating Tabs (右下浮在圖上) -->
      <div class="absolute -bottom-6 right-4 flex gap-3 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-soft">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          class="flex flex-col items-center text-xs"
          :class="currentTab === tab.key ? 'text-ink font-semibold' : 'text-gray-400'"
        >
          <span class="text-lg leading-none">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-10 px-4 pb-24 max-w-md mx-auto">
      <!-- 行程 -->
      <section v-if="currentTab === 'schedule'">
        <div class="flex items-end justify-between mb-3">
          <h2 class="text-lg font-bold">每日行程表</h2>

          <!-- 分類下拉（先做 UI） -->
          <select v-model="filterCategory" class="text-sm bg-white rounded-xl px-3 py-2 shadow-soft">
            <option value="all">全部</option>
            <option value="景點">景點</option>
            <option value="住宿">住宿</option>
            <option value="美食">美食</option>
            <option value="購物">購物</option>
            <option value="航班">航班</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <!-- 日期橫向滑動：星期在上、日期數字在下 -->
        <div class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="d in days"
            :key="d.date"
            @click="activeDate = d.date"
            class="min-w-[66px] text-center px-3 py-2 rounded-xl shadow-soft"
            :class="activeDate === d.date ? 'bg-latte' : 'bg-white'"
          >
            <div class="text-sm font-semibold">{{ d.week }}</div>
            <div class="text-2xl leading-none">{{ d.day }}</div>
          </button>
        </div>

        <!-- 天氣資訊（先做 UI，下一步接 API） -->
        <div class="mt-4 bg-white rounded-xl2 shadow-soft p-4 flex items-center gap-4">
          <div class="text-3xl">{{ weather.icon }}</div>
          <div class="min-w-0">
            <div class="font-semibold">那霸天氣</div>
            <div class="text-sm text-gray-500 truncate">
              {{ weather.temp }}°C / 體感 {{ weather.feelsLike }}°C
            </div>
          </div>
        </div>

        <!-- 航班卡（第一天第一個行程呈現不同） -->
        <div v-if="activeDate === '2025-12-22'" class="mt-4 bg-white rounded-xl2 shadow-soft p-4">
          <div class="flex items-center justify-between">
            <div class="font-semibold">✈️ 12/22 台北 → 沖繩（樂桃）</div>
            <span class="text-xs bg-latte px-2 py-1 rounded-full">航班</span>
          </div>
          <div class="text-sm text-gray-500 mt-1">09:45 TPE T1 → 12:25 OKA</div>
          <div class="text-xs text-gray-500 mt-2">
            備註：Trip 1616327356986648｜PIN 6053｜PNR GHXYXX
          </div>
        </div>

        <!-- 行程列表 -->
        <div class="mt-4 space-y-4">
          <div
            v-for="item in filteredDayItems"
            :key="item.id"
            class="bg-white rounded-xl2 shadow-soft p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="font-semibold truncate">{{ item.name }}</div>

                <div class="mt-1 text-xs text-gray-500 flex flex-wrap items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-latte">{{ item.category }}</span>
                  <span v-if="item.openHours">🕒 {{ item.openHours }}</span>
                  <span v-if="item.ticket">🎟️ {{ item.ticket }}</span>
                </div>
              </div>

              <a
                :href="item.mapUrl"
                target="_blank"
                class="shrink-0 text-xs text-blue-600"
              >
                導航 →
              </a>
            </div>

            <div v-if="item.note" class="text-sm text-gray-500 mt-2">
              {{ item.note }}
            </div>
          </div>
        </div>

        <!-- 新增行程 FAB -->
        <button
          class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-earth text-white text-3xl shadow-soft active:scale-95 transition"
          aria-label="新增行程"
          title="新增行程"
        >
          +
        </button>
      </section>

      <!-- 航班資訊 -->
      <section v-else-if="currentTab === 'flight'">
        <h2 class="text-lg font-bold mb-4">航班資訊</h2>

        <div class="space-y-3">
          <div class="bg-white rounded-xl2 shadow-soft p-4">
            <div class="font-semibold">12/22（週一）台北 → 沖繩｜樂桃</div>
            <div class="text-sm text-gray-500 mt-1">09:45 TPE T1 → 12:25 OKA</div>
            <div class="text-xs text-gray-500 mt-2">
              備註：Trip 1616327356986648｜PIN 6053｜PNR GHXYXX
            </div>
          </div>

          <div class="bg-white rounded-xl2 shadow-soft p-4">
            <div class="font-semibold">12/26（週五）沖繩 → 台北｜樂桃</div>
            <div class="text-sm text-gray-500 mt-1">16:50 OKA → 17:35 TPE T1</div>
            <div class="text-xs text-gray-500 mt-2">
              備註：Trip 1616327358187992｜PIN 7588｜PNR X2V5RW
            </div>
          </div>

          <div class="bg-white rounded-xl2 shadow-soft p-4">
            <div class="font-semibold">住宿：沖繩那霸柔婕閣飯店</div>
            <div class="text-sm text-gray-500 mt-1">〒900-0032 沖縄県那覇松山2丁目2-9</div>
            <a
              class="text-xs text-blue-600 mt-2 inline-block"
              target="_blank"
              href="https://www.google.com/maps/search/?api=1&query=%E6%B2%96%E7%B8%84%E9%82%A3%E8%A6%87%E6%9F%94%E5%A9%95%E9%96%A3%E9%A3%AF%E5%BA%97"
            >
              導航 →
            </a>
            <div class="text-xs text-gray-500 mt-2">電話：+81-98-8945600</div>
          </div>

          <div class="bg-white rounded-xl2 shadow-soft p-4">
            <div class="font-semibold">租車：OTS</div>
            <div class="text-sm text-gray-500 mt-1">預約號碼：OTS1387419</div>
            <div class="text-xs text-gray-500 mt-2">提車：2025/12/22 13:30（臨空豐崎營業所）</div>
            <div class="text-xs text-gray-500">還車：2025/12/26 13:00（臨空豐崎營業所）</div>
          </div>
        </div>
      </section>

      <!-- 購物清單 -->
      <section v-else-if="currentTab === 'shopping'">
        <h2 class="text-lg font-bold mb-4">購物清單</h2>

        <div class="space-y-3">
          <div class="bg-white rounded-xl2 shadow-soft p-4 flex items-center justify-between">
            <div class="font-medium">泡澡球（Seria）</div>
            <span class="text-xs bg-latte px-2 py-1 rounded-full">想買</span>
          </div>
        </div>

        <button
          class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-earth text-white text-3xl shadow-soft active:scale-95 transition"
          aria-label="新增購物"
          title="新增購物"
        >
          +
        </button>
      </section>

      <!-- 花費 -->
      <section v-else>
        <h2 class="text-lg font-bold mb-2">花費</h2>

        <div class="bg-white rounded-xl2 shadow-soft p-4 mb-4">
          <div class="text-sm text-gray-500">總花費</div>
          <div class="text-2xl font-bold">¥ {{ totalJpy }}</div>
        </div>

        <div class="space-y-3">
          <div class="bg-white rounded-xl2 shadow-soft p-4">
            <div class="flex items-center justify-between">
              <div class="font-medium">晚餐</div>
              <div class="font-semibold">¥3500</div>
            </div>
            <div class="text-xs text-gray-500 mt-1">類別：飲食｜付款：現金</div>
          </div>
        </div>

        <button
          class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-earth text-white text-3xl shadow-soft active:scale-95 transition"
          aria-label="新增花費"
          title="新增花費"
        >
          +
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const currentTab = ref("schedule");
const activeDate = ref("2025-12-22");
const filterCategory = ref("all");

const tabs = [
  { key: "schedule", label: "行程", icon: "📍" },
  { key: "flight", label: "航班", icon: "✈️" },
  { key: "shopping", label: "購物", icon: "🛒" },
  { key: "expense", label: "花費", icon: "💰" }
];

const days = [
  { week: "Mon", day: 22, date: "2025-12-22" },
  { week: "Tue", day: 23, date: "2025-12-23" },
  { week: "Wed", day: 24, date: "2025-12-24" },
  { week: "Thu", day: 25, date: "2025-12-25" },
  { week: "Fri", day: 26, date: "2025-12-26" }
];

// 先用固定值，下一步接天氣 API
const weather = ref({ icon: "☀️", temp: 26, feelsLike: 28 });

const scheduleByDate = {
  "2025-12-22": [
    {
      id: "d1-1",
      category: "景點",
      name: "iias 沖繩豐崎 & DMM 水族館",
      note: "抵達沖繩 & 13:30 租車後前往",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=iias%20%E6%B2%96%E7%B8%84%E8%B1%90%E5%B4%8E"
    },
    {
      id: "d1-2",
      category: "美食",
      name: "阿古豬晚餐",
      note: "18:45 已預訂，吃飽自由活動",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E9%98%BF%E5%8F%A4%E8%B1%AC%20%E6%B2%96%E7%B8%84"
    }
  ],
  "2025-12-23": [
    {
      id: "d2-1",
      category: "景點",
      name: "瀨底島（玻璃船集合）",
      note: "10:10 出發（12:20 集合）",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E7%80%A8%E5%BA%95%E5%B3%B6"
    },
    {
      id: "d2-2",
      category: "景點",
      name: "名護鳳梨園",
      note: "14:00",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%90%8D%E8%AD%B7%E9%B3%B3%E6%A2%A8%E5%9C%92"
    },
    {
      id: "d2-3",
      category: "購物",
      name: "AEON 名護永旺（購物/晚餐）",
      note: "晚間回國際通逛街、屋台村、Daiso",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=AEON%20%E5%90%8D%E8%AD%B7"
    }
  ],
  "2025-12-24": [
    {
      id: "d3-1",
      category: "景點",
      name: "沖繩兒童王國",
      note: "11:00",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E6%B2%96%E7%B8%84%E5%85%92%E7%AB%A5%E7%8E%8B%E5%9C%8B"
    },
    {
      id: "d3-2",
      category: "美食",
      name: "Shinmei Coffee / Fluffy Coconut",
      note: "黑糖拿鐵或生甜甜圈",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Shinmei%20Coffee%20Okinawa"
    },
    {
      id: "d3-3",
      category: "購物",
      name: "美國村（找泡澡球 Seria）",
      note: "20:00 看煙火，20:30 回飯店",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E7%BE%8E%E5%9C%8B%E6%9D%91%20%E6%B2%96%E7%B8%84"
    }
  ],
  "2025-12-25": [
    {
      id: "d4-1",
      category: "購物",
      name: "Parco City（午餐後逛 3F 童裝區）",
      note: "12:00",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Parco%20City%20Okinawa"
    },
    {
      id: "d4-2",
      category: "景點",
      name: "西來院（達摩寺）",
      note: "推薦：首里蕎麥麵（近達摩寺）",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E8%A5%BF%E4%BE%86%E9%99%A2%20%E6%B2%96%E7%B8%84"
    },
    {
      id: "d4-3",
      category: "景點",
      name: "琉球八社",
      note: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E7%90%89%E7%90%83%E5%85%AB%E7%A4%BE"
    },
    {
      id: "d4-4",
      category: "美食",
      name: "Midnight Sweets（國際通甜點）",
      note: "之後自由活動",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Midnight%20Sweets%20Naha"
    }
  ],
  "2025-12-26": [
    {
      id: "d5-1",
      category: "購物",
      name: "國際通自由活動（最後採購）",
      note: "13:00 預計還車，機場最後伴手禮",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%E5%9C%8B%E9%9A%9B%E9%80%9A%20%E9%82%A3%E9%9C%B8"
    }
  ]
};

const dayItems = computed(() => scheduleByDate[activeDate.value] || []);

const filteredDayItems = computed(() => {
  if (filterCategory.value === "all") return dayItems.value;
  return dayItems.value.filter((x) => x.category === filterCategory.value);
});

const totalJpy = computed(() => 3500);
</script>
