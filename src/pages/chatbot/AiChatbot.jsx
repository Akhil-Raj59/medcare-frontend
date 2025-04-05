import React, { useState, useRef, useEffect } from "react";
import { sendMessage, analyzeImage } from "../../services/api";

const MedicalChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const endOfMessagesRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle text message submission
  const handleSendMessage = async () => {
    if (!input.trim() && !image) return;

    const userMessage = { 
      role: "user", 
      content: input.trim() || (image ? "[Uploaded an Image]" : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (image) {
        const analysis = await analyzeImage(image);
        setMessages(prev => [...prev, { 
          role: "bot", 
          content: analysis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setImage(null);
      } else {
        const botReply = await sendMessage(input);
        setMessages(prev => [...prev, { 
          role: "bot", 
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: "I'm sorry, I encountered an error processing your medical request. Please try again or contact support.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop for images
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Clear image selection
  const handleClearImage = () => {
    setImage(null);
  };

  // Trigger file input click
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full  max-w-xl my-9 mx-auto bg-white rounded-2xl shadow-lg overflow-hidden md:max-w-2xl lg:max-w-4xl border border-gray-100">
      <div className="flex flex-col h-[700px]">
        {/* Header */}
        <div className="px-6 py-5 bg-teal-600 flex items-center">
          <div className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Medical Assistant</h2>
            <p className="text-teal-100 text-sm">Ask about procedures, upload medical images, or get health information</p>
          </div>
        </div>

        {/* Chat History */}
        <div 
          className="flex-1 p-5 overflow-y-auto bg-gray-50"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6">
              <div className="bg-teal-50 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Medical Assistant</h3>
              <p className="text-center mb-2">How can I help with your medical questions today?</p>
              <p className="text-center text-sm text-gray-500">You can ask about procedures, upload medical images, or get general health information.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role !== "user" && (
                    <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                    msg.role === "user" 
                      ? "bg-teal-500 text-white rounded-tr-none shadow-sm" 
                      : msg.isError 
                        ? "bg-red-50 text-red-800 rounded-tl-none border border-red-100" 
                        : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                  }`}>
                    <p className="break-words leading-relaxed">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-75 text-right">{msg.timestamp}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-teal-400 flex items-center justify-center text-white ml-2 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
          )}
          
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-teal-500 bg-opacity-10 flex items-center justify-center rounded-lg border-2 border-teal-500 border-dashed z-10">
              <div className="text-center p-6 rounded-lg bg-white bg-opacity-90 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-teal-600 font-medium">Drop medical image here</p>
                <p className="text-gray-500 text-sm mt-1">For consultation purposes</p>
              </div>
            </div>
          )}
        </div>

        {/* Image preview */}
        {image && (
          <div className="p-3 bg-gray-100 border-t border-gray-200">
            <div className="flex items-center">
              <div className="relative inline-block">
                <img src={image} alt="Medical image" className="h-16 w-auto object-cover rounded-md border border-gray-300" />
                <button 
                  onClick={handleClearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
              <span className="ml-3 text-sm text-gray-600">Medical image attached</span>
            </div>
          </div>
        )}

        {/* Input Controls */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent resize-none text-gray-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your medical question..."
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <button 
                className="absolute right-3 bottom-3 text-teal-500 hover:text-teal-700 p-1 transition-colors"
                onClick={handleImageButtonClick}
                aria-label="Upload image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </div>
            <button 
              className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12 h-12"
              onClick={handleSendMessage}
              disabled={loading || (!input.trim() && !image)}
              aria-label="Send message"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-xs text-center mt-3 text-gray-500">
            Need urgent medical attention? Please call emergency services.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;