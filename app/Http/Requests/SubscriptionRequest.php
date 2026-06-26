<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tool_name' => ['required', 'string', 'max:255'],
            'department_owner' => ['required', 'string', 'max:255'],
            'renewal_date' => ['required', 'date'],
            'monthly_cost' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:Active,Expiring Soon,Expired,Cancelled'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
