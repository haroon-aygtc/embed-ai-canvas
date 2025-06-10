<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class WidgetOperatingHour extends Model
{
    protected $fillable = [
        'widget_id',
        'day_of_week',
        'enabled',
        'start_time',
        'end_time',
        'timezone',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'day_of_week' => 'integer',
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
    ];

    /**
     * Get the widget that owns these operating hours.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Scope to get only enabled operating hours.
     */
    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    /**
     * Scope to filter by day of week.
     */
    public function scopeForDay($query, $dayOfWeek)
    {
        return $query->where('day_of_week', $dayOfWeek);
    }

    /**
     * Get day names mapping.
     */
    public static function getDayNames(): array
    {
        return [
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
        ];
    }

    /**
     * Get the day name for this operating hour.
     */
    public function getDayNameAttribute(): string
    {
        return static::getDayNames()[$this->day_of_week] ?? 'Unknown';
    }

    /**
     * Check if the widget is currently operating.
     */
    public static function isWidgetOperating(int $widgetId, string $timezone = 'UTC'): bool
    {
        $now = Carbon::now($timezone);
        $dayOfWeek = $now->dayOfWeek;
        $currentTime = $now->format('H:i:s');

        $operatingHour = static::where('widget_id', $widgetId)
                              ->where('day_of_week', $dayOfWeek)
                              ->where('enabled', true)
                              ->first();

        if (!$operatingHour) {
            return false;
        }

        $startTime = Carbon::createFromFormat('H:i:s', $operatingHour->start_time)->format('H:i:s');
        $endTime = Carbon::createFromFormat('H:i:s', $operatingHour->end_time)->format('H:i:s');

        return $currentTime >= $startTime && $currentTime <= $endTime;
    }

    /**
     * Get next operating time for a widget.
     */
    public static function getNextOperatingTime(int $widgetId, string $timezone = 'UTC'): ?Carbon
    {
        $now = Carbon::now($timezone);
        $currentDayOfWeek = $now->dayOfWeek;

        // Check remaining days of the week starting from today
        for ($i = 0; $i < 7; $i++) {
            $checkDay = ($currentDayOfWeek + $i) % 7;
            $checkDate = $now->copy()->addDays($i);

            $operatingHour = static::where('widget_id', $widgetId)
                                  ->where('day_of_week', $checkDay)
                                  ->where('enabled', true)
                                  ->first();

            if ($operatingHour) {
                $startTime = Carbon::createFromFormat('H:i:s', $operatingHour->start_time, $timezone);
                $nextOperatingTime = $checkDate->setTime($startTime->hour, $startTime->minute, $startTime->second);

                // If it's today, make sure the time hasn't passed
                if ($i === 0 && $nextOperatingTime <= $now) {
                    continue;
                }

                return $nextOperatingTime;
            }
        }

        return null;
    }

    /**
     * Create default operating hours for a widget (Monday-Friday, 9 AM - 5 PM).
     */
    public static function createDefaultForWidget(int $widgetId, string $timezone = 'UTC'): void
    {
        $defaultHours = [
            ['day_of_week' => 1, 'enabled' => true, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Monday
            ['day_of_week' => 2, 'enabled' => true, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Tuesday
            ['day_of_week' => 3, 'enabled' => true, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Wednesday
            ['day_of_week' => 4, 'enabled' => true, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Thursday
            ['day_of_week' => 5, 'enabled' => true, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Friday
            ['day_of_week' => 6, 'enabled' => false, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Saturday
            ['day_of_week' => 0, 'enabled' => false, 'start_time' => '09:00:00', 'end_time' => '17:00:00'], // Sunday
        ];

        foreach ($defaultHours as $hour) {
            static::create([
                'widget_id' => $widgetId,
                'timezone' => $timezone,
                ...$hour
            ]);
        }
    }

    /**
     * Get operating hours data for frontend.
     */
    public function toOperatingHourData(): array
    {
        return [
            'day' => $this->day_name,
            'dayOfWeek' => $this->day_of_week,
            'enabled' => $this->enabled,
            'start' => $this->start_time ? Carbon::parse($this->start_time)->format('H:i') : '09:00',
            'end' => $this->end_time ? Carbon::parse($this->end_time)->format('H:i') : '17:00',
            'timezone' => $this->timezone,
        ];
    }
}
