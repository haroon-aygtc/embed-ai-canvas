<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WidgetChatService;
use App\Models\Widget;

class WidgetChatController extends Controller
{
    public function __construct(
        private WidgetChatService $widgetChatService
    ) {}

    public function store(Request $request)
    {
        $widget = Widget::find($request->widget_id);
        $chat = $this->widgetChatService->createChat($widget, $request->all());
        return response()->json($chat, 201);
    }

    public function update(Request $request, $id)
    {
        $chat = $this->widgetChatService->updateChat($id, $request->all());
        return response()->json($chat, 200);
    }

    public function show(Request $request, $id)
    {
        $chat = $this->widgetChatService->getChat($id);
        return response()->json($chat);
    }

    public function getSummary(Request $request, $id)
    {
        $summary = $this->widgetChatService->getSummary($id);
        return response()->json($summary);
    }

    public function sendTestMessage(Request $request, $id)
    {
        $testMessage = $this->widgetChatService->sendTestMessage($id);
        return response()->json($testMessage);
    }

    public function getConversationStarters(Request $request, $id)
    {
        $conversationStarters = $this->widgetChatService->getConversationStarters($id);
        return response()->json($conversationStarters);
    }

    public function bulkUpdate(Request $request, $id)
    {
        $bulkUpdate = $this->widgetChatService->bulkUpdate($id, $request->all());
        return response()->json($bulkUpdate);
    }

    public function getAssets(Request $request, $id)
    {
        $assets = $this->widgetChatService->getAssets($id);
        return response()->json($assets);
    }
}
