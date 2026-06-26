<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'tool_name',
        'department_owner',
        'renewal_date',
        'monthly_cost',
        'status',
        'notes',
    ];

    protected $casts = [
        'renewal_date' => 'date',
        'monthly_cost' => 'decimal:2',
    ];
}
