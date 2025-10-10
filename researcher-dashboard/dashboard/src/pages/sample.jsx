const Sample = () => {
  console.log('🧪 Sample component rendering...');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Sample Page</h1>
      <p className="text-gray-600">This is a test page to check if routing works.</p>
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <p className="text-blue-800">If you can see this, the routing is working!</p>
      </div>
    </div>
  );
};

export default Sample;