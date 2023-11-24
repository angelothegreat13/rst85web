
/**
 * @date 2023.6.5 23:45
 * @author jup
 * @dependancies jquery > v1.11.3
 * 
 * 3개의 콤보박스로 날짜선택 구현
 * 
 * html구조를 다음과 같이 하면 자동 처리된다.
 * ```html
 * <div class="combos-datepicker">
 * 	<select name="year" class="combos-year" onchange="combosDatePicker.onChangeYear(this);"> ... </select>
 * 	<select name="month" class="combos-month" onchange="combosDatePicker.onChangeMonth(this);"> ... </select>
 * 	<select name="day" class="combos-day" onchange="combosDatePicker.onChangeDay(this);"> ... </select>
 * </div>
 * ```
 */

var combosDatePicker = {

	onChangeYear: function (_this) {
		return this.patchDayCombo(_this);
	},
	onChangeMonth: function (_this) {
		return this.patchDayCombo(_this);
	},
	onChangeDay: function (_this) {
		return true;
	},

	patchDayCombo: function (_this) {
		let year = this.getElemYear(_this).val() | 0;
		let month = this.getElemMonth(_this).val() | 0;
		let maxDays = this.getMaxDays(year, month);

		let $day = this.getElemDay(_this);
		
		for (let day = 28; day <= 31; day ++) {
			if (day <= maxDays) {
				$day.find(`option[value=${day}]`).show();
			} else {
				$day.find(`option[value=${day}]`).hide();
			}
		}
		if ($day.val() > maxDays) {
			$day.val(maxDays)
		}
		return 1;
	},

	getElemYear: function (_this) {
		return this.getElemWrapper(_this).find(this._sel.year);
	},
	getElemMonth: function (_this) {
		return this.getElemWrapper(_this).find(this._sel.month);
	},
	getElemDay: function (_this) {
		return this.getElemWrapper(_this).find(this._sel.day);
	},
	getElemWrapper: function (_this) {
		return $(_this).closest(this._sel.wrapper);
	},
	
	getMaxDays: function(year, month) {
		if (!this._days[month]) return 0;
		if (month != 2) return this._days[month];
		return this._days[month] + this.isLeap(year);
	},
	isLeap: function(year) {
		return (year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0));
	},

	_days: [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	_sel: {
		wrapper: '.combos-datepicker',
		year: '.combos-year',
		month: '.combos-month',
		day: '.combos-day',
	},
};
