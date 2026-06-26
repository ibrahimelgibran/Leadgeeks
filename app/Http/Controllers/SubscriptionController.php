<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubscriptionRequest;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    protected array $statuses = [
        'Active',
        'Expiring Soon',
        'Expired',
        'Cancelled',
    ];

    public function index(Request $request)
    {
        $query = Subscription::query();

        if ($search = $request->input('search')) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('tool_name', 'like', "%{$search}%")
                    ->orWhere('department_owner', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $subscriptions = $query->orderBy('renewal_date')->paginate(10);

        return response()->json([
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['search', 'status']),
            'dashboard' => [
                'total' => Subscription::count(),
                'active' => Subscription::where('status', 'Active')->count(),
                'expiring' => Subscription::where('status', 'Expiring Soon')->count(),
                'expired' => Subscription::where('status', 'Expired')->count(),
            ],
            'statusOptions' => $this->statuses,
        ]);
    }

    public function store(SubscriptionRequest $request)
    {
        $data = $request->validated();

        $subscription = Subscription::create($data);

        return response()->json([
            'message' => 'Subscription added successfully.',
            'subscription' => $subscription,
        ], 201);
    }

    public function show(Subscription $subscription)
    {
        return response()->json([
            'subscription' => $subscription,
            'statusOptions' => $this->statuses,
        ]);
    }

    public function update(SubscriptionRequest $request, Subscription $subscription)
    {
        $data = $request->validated();
        // Keep the status as chosen by user, don't auto-calculate on update

        $subscription->update($data);

        return response()->json([
            'message' => 'Subscription updated successfully.',
            'subscription' => $subscription,
        ]);
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return response()->json([
            'message' => 'Subscription removed successfully.',
        ]);
    }

    public function export(Request $request)
    {
        $query = Subscription::query();

        if ($search = $request->input('search')) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('tool_name', 'like', "%{$search}%")
                    ->orWhere('department_owner', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $filename = 'subscriptions_' . now()->format('Ymd_His') . '.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tool Name', 'Department Owner', 'Renewal Date', 'Monthly Cost', 'Status', 'Notes']);

            foreach ($query->orderBy('renewal_date')->get() as $subscription) {
                fputcsv($handle, [
                    $subscription->tool_name,
                    $subscription->department_owner,
                    (string) $subscription->renewal_date,
                    number_format($subscription->monthly_cost, 2),
                    $subscription->status,
                    $subscription->notes,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Cache-Control' => 'no-store, no-cache',
        ]);
    }

    protected function resolveStatus(array $data, Subscription $subscription = null): string
    {
        if ($data['status'] === 'Cancelled') {
            return 'Cancelled';
        }

        $renewalDate = Carbon::parse($data['renewal_date']);
        $today = Carbon::today();
        $days = $today->diffInDays($renewalDate, false);

        if ($days < 0) {
            return 'Expired';
        }

        return $days <= 7 ? 'Expiring Soon' : 'Active';
    }
}
