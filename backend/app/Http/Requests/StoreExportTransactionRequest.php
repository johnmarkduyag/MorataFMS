<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExportTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth handled by middleware
    }

    public function rules(): array
    {
        return [
            'shipper_id' => ['required', 'exists:clients,id'],
            'bl_no' => ['required', 'string', 'max:50'],
            'vessel' => ['required', 'string', 'max:100'],
            'destination_country_id' => ['required', 'exists:countries,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'shipper_id.required' => 'Please select a shipper.',
            'shipper_id.exists' => 'The selected shipper does not exist.',
            'bl_no.required' => 'Bill of Lading number is required.',
            'vessel.required' => 'Vessel name is required.',
            'destination_country_id.required' => 'Please select a destination country.',
            'destination_country_id.exists' => 'The selected destination country does not exist.',
        ];
    }
}
