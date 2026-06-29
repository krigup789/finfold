// Online C++ compiler to run C++ program online
#include <iostream>
#include <string>
#include <regex>

std::string removeTimestamps(const std::string& input) {
    // Regex to match: 2025-12-14 14:14:23.420 INFO␣
    std::regex timestamp_pattern(
        R"(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}\sINFO\s)"
    );

    // Remove timestamps
    return std::regex_replace(input, timestamp_pattern, "");
}


int main() {
    std::string log = R"(
    
    
2025-12-14 15:34:09.324 INFO state = {
2025-12-14 15:34:09.323 INFO # ---- POSITION STATE ----
2025-12-14 15:34:09.321 INFO "position_qty": 1,
2025-12-14 15:34:09.320 INFO "avg_entry_price": 13764.0,
2025-12-14 15:34:09.318 INFO # ---- INDICATOR STATE ----
2025-12-14 15:34:09.316 INFO "last_b_percent": 0.01,
2025-12-14 15:34:09.315 INFO "closes": deque(
2025-12-14 15:34:09.313 INFO [
2025-12-14 15:34:09.312 INFO 13652.0,
2025-12-14 15:34:09.310 INFO 13641.0,
2025-12-14 15:34:09.309 INFO 13649.0,
2025-12-14 15:34:09.307 INFO 13650.0,
2025-12-14 15:34:09.305 INFO 13645.0,
2025-12-14 15:34:09.304 INFO 13655.0,
2025-12-14 15:34:09.302 INFO 13651.0,
2025-12-14 15:34:09.301 INFO 13657.0,
2025-12-14 15:34:09.299 INFO 13654.0,
2025-12-14 15:34:09.297 INFO 13655.0,
2025-12-14 15:34:09.296 INFO 13659.0,
2025-12-14 15:34:09.294 INFO 13657.0,
2025-12-14 15:34:09.293 INFO 13656.0,
2025-12-14 15:34:09.291 INFO 13657.0,
2025-12-14 15:34:09.289 INFO 13657.0,
2025-12-14 15:34:09.288 INFO 13651.0,
2025-12-14 15:34:09.286 INFO 13650.0,
2025-12-14 15:34:09.285 INFO 13640.0,
2025-12-14 15:34:09.283 INFO 13650.0,
2025-12-14 15:34:09.282 INFO 13640.0,
2025-12-14 15:34:09.280 INFO ],
2025-12-14 15:34:09.278 INFO maxlen=max(BB_PERIOD * 5, BB_PERIOD),
2025-12-14 15:34:09.277 INFO ),
2025-12-14 15:34:09.275 INFO # ---- CANDLE CONTEXT ----
2025-12-14 15:34:09.274 INFO "current_candle_start": None,
2025-12-14 15:34:09.272 INFO "current_candle_ohlc": {
2025-12-14 15:34:09.270 INFO "open": None,
2025-12-14 15:34:09.269 INFO "high": None,
2025-12-14 15:34:09.267 INFO "low": None,
2025-12-14 15:34:09.265 INFO "close": None,
2025-12-14 15:34:09.264 INFO },
2025-12-14 15:34:09.263 INFO # ---- LADDER STATE ----
2025-12-14 15:34:09.261 INFO "buy_count": 1,
2025-12-14 15:34:09.259 INFO "last_buy_qty": 1,
2025-12-14 15:34:09.258 INFO "last_buy_price": 13764.0,
2025-12-14 15:34:09.256 INFO # ---- PNL ----
2025-12-14 15:34:09.255 INFO "realized_pnl": 0.0,
2025-12-14 15:34:09.253 INFO # ---- META ----
2025-12-14 15:34:09.252 INFO "live_seeded": True,
2025-12-14 15:34:09.250 INFO # 🔒 SNAPSHOT FLAG (ADDED)
2025-12-14 15:34:09.249 INFO "snapshot_1529_done": False,
2025-12-14 15:34:09.247 INFO "snapshot_2358_done": False,
2025-12-14 15:34:09.246 INFO }


    )";

    std::string cleaned = removeTimestamps(log);
    std::cout << cleaned;

    return 0;
}
