import React, { useState } from 'react';

interface ChatBoxProps {
  itemTitle: string;
  onClose: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ itemTitle, onClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-80 p-4 z-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{itemTitle} 채팅</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">닫기</button>
      </div>
      <div className="h-40 overflow-y-auto border rounded mb-2 p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1 text-sm">{msg}</div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded px-2 py-1 mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지 입력..."
        />
        <button onClick={handleSend} className="bg-primary text-white px-3 py-1 rounded">전송</button>
      </div>
    </div>
  );
};