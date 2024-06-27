'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const colors = ["#000000", "#0074D9", "#FF4136", "#2ECC40", "#FFDC00", "#AAAAAA", "#F012BE", "#FF851B", "#7FDBFF", "#870C25"];

const MatrixTransformationApp = () => {
  const [trainData, setTrainData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [currentSet, setCurrentSet] = useState('train');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [viewMode, setViewMode] = useState('single');

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setTrainData(data.train || []);
        setTestData(data.test || []);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Error parsing JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const getCurrentData = () => currentSet === 'train' ? trainData : testData;

  const handlePrevious = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex(prev => Math.min(getCurrentData().length - 1, prev + 1));

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    console.log("Code submitted:", code);
    // TODO: Implement actual matrix transformation
  };

  const getMaxOutputDimensions = () => {
    let maxRows = 0;
    let maxCols = 0;
    getCurrentData().forEach(example => {
      if (example.output) {
        maxRows = Math.max(maxRows, example.output.length);
        maxCols = Math.max(maxCols, example.output[0].length);
      }
    });
    return { maxRows, maxCols };
  };

  const renderMatrix = (matrix, title, isOutput = false) => {
    const { maxRows, maxCols } = getMaxOutputDimensions();
    const cellSize = isOutput ? 30 : 30 * (maxRows / matrix.length);

    return (
      <div className="w-full">
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <div className="border border-gray-300 p-2 inline-block">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${matrix[0].length}, ${cellSize}px)`,
              gap: '1px',
            }}
          >
            {matrix.flat().map((cell, index) => (
              <div
                key={index}
                style={{ 
                  width: `${cellSize}px`, 
                  height: `${cellSize}px`, 
                  backgroundColor: colors[cell],
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExample = (example, index) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">Example {index + 1}</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {renderMatrix(example.input, "Input")}
          {renderMatrix(example.input, "Intermediate")}
          {currentSet === 'train' && renderMatrix(example.output, "True Output", true)}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Matrix Transformation App</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <Label htmlFor="jsonUpload">Upload JSON:</Label>
              <Input
                id="jsonUpload"
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="flex-grow"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span>Test Mode</span>
                <Switch
                  checked={currentSet === 'test'}
                  onCheckedChange={(checked) => setCurrentSet(checked ? 'test' : 'train')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>View All</span>
                <Switch
                  checked={viewMode === 'all'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'all' : 'single')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {getCurrentData().length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{currentSet === 'train' ? 'Training' : 'Test'} Examples</h2>
            {viewMode === 'single' ? (
              <div>
                {getCurrentData()[currentIndex] && renderExample(getCurrentData()[currentIndex], currentIndex)}
                <div className="flex justify-between mt-4">
                  <Button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</Button>
                  <span>Example {currentIndex + 1} of {getCurrentData().length}</span>
                  <Button onClick={handleNext} disabled={currentIndex === getCurrentData().length - 1}>Next</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentData().map((example, index) => renderExample(example, index))}
              </div>
            )}
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Transformation Code</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit}>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mb-2 font-mono"
                placeholder="Enter matrix transformation code..."
                rows={10}
              />
              <Button type="submit">Apply Transformation</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Color Map</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-6 h-6 mr-1 border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <span>{index}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Home() {
  return <MatrixTransformationApp />;
}