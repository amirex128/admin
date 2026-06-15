<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Province;
use Illuminate\Database\Seeder;

/**
 * Seeds the comprehensive list of Iranian provinces and cities.
 *
 * Data is loaded from database/data/iran_provinces_cities.json when present so
 * the full dataset can be dropped in without code changes. When the file is
 * missing the seeder falls back to the 31 provinces (without cities) so the
 * location selectors keep working.
 */
class IranLocationSeeder extends Seeder
{
    /**
     * The province → cities dataset is idempotently upserted on every run.
     */
    public function run(): void
    {
        foreach ($this->dataset() as $provinceName => $cities) {
            $province = Province::query()->firstOrCreate(['name' => $provinceName]);

            foreach ($cities as $cityName) {
                City::query()->firstOrCreate([
                    'province_id' => $province->id,
                    'name' => $cityName,
                ]);
            }
        }
    }

    /**
     * Resolve the dataset as a map of province name => list of city names.
     *
     * @return array<string, array<int, string>>
     */
    protected function dataset(): array
    {
        $payload = $this->loadJson();

        if ($payload === null) {
            // Fallback: the 31 provinces of Iran (cities supplied later via JSON).
            return array_fill_keys($this->fallbackProvinces(), []);
        }

        return $this->normalize($payload);
    }

    /**
     * Load and decode the JSON dataset if it exists.
     *
     * @return array<mixed>|null
     */
    protected function loadJson(): ?array
    {
        foreach (['iran_provinces_cities.json', 'iran-provinces-cities.json'] as $file) {
            $path = database_path('data/'.$file);

            if (is_file($path)) {
                $decoded = json_decode((string) file_get_contents($path), true);

                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        }

        return null;
    }

    /**
     * Normalize the various accepted JSON shapes into a province => cities map.
     *
     * Accepted shapes:
     *  - { "تهران": ["تهران", "ری"], ... }
     *  - [ { "name": "تهران", "cities": ["تهران"] }, ... ]
     *  - [ { "province": "تهران", "cities": [ { "name": "ری" } ] }, ... ]
     *
     * @param  array<mixed>  $payload
     * @return array<string, array<int, string>>
     */
    protected function normalize(array $payload): array
    {
        $result = [];

        if (array_is_list($payload)) {
            foreach ($payload as $entry) {
                if (! is_array($entry)) {
                    continue;
                }

                $name = $entry['name'] ?? $entry['province'] ?? $entry['title'] ?? null;

                if (! is_string($name) || $name === '') {
                    continue;
                }

                $result[$name] = $this->cityNames($entry['cities'] ?? []);
            }

            return $result;
        }

        foreach ($payload as $name => $cities) {
            if (is_string($name) && is_array($cities)) {
                $result[$name] = $this->cityNames($cities);
            }
        }

        return $result;
    }

    /**
     * Extract plain city names from a list of strings or objects.
     *
     * @param  mixed  $cities
     * @return array<int, string>
     */
    protected function cityNames($cities): array
    {
        if (! is_array($cities)) {
            return [];
        }

        $names = [];

        foreach ($cities as $city) {
            if (is_string($city) && $city !== '') {
                $names[] = $city;
            } elseif (is_array($city)) {
                $name = $city['name'] ?? $city['title'] ?? null;

                if (is_string($name) && $name !== '') {
                    $names[] = $name;
                }
            }
        }

        return $names;
    }

    /**
     * The 31 provinces of Iran used when no JSON dataset is available.
     *
     * @return array<int, string>
     */
    protected function fallbackProvinces(): array
    {
        return [
            'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز',
            'ایلام', 'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی',
            'خراسان رضوی', 'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان',
            'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان',
            'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان',
            'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
        ];
    }
}
