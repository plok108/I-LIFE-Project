import React from 'react';
import { Upload, X, Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

// Form Input with Label
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export function FormInput({ 
  label, 
  error, 
  description, 
  required, 
  className = "", 
  ...props 
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        className={`${error ? 'border-destructive focus:border-destructive' : ''} ${className}`}
        {...props}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// Password Input with Toggle
interface PasswordInputProps extends Omit<FormInputProps, 'type'> {
  showPasswordToggle?: boolean;
}

export function PasswordInput({ 
  showPasswordToggle = true, 
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="flex items-center gap-1">
        {props.label}
        {props.required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={`pr-10 ${props.error ? 'border-destructive focus:border-destructive' : ''} ${props.className}`}
          {...props}
        />
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
      {props.description && (
        <p className="text-xs text-muted-foreground">{props.description}</p>
      )}
      {props.error && (
        <p className="text-xs text-destructive">{props.error}</p>
      )}
    </div>
  );
}

// Form Textarea
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export function FormTextarea({ 
  label, 
  error, 
  description, 
  required, 
  className = "", 
  ...props 
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        className={`${error ? 'border-destructive focus:border-destructive' : ''} ${className}`}
        {...props}
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// Form Select
interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
}

export function FormSelect({ 
  label, 
  placeholder = "선택하세요", 
  options, 
  value, 
  onValueChange, 
  error, 
  description, 
  required 
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={error ? 'border-destructive focus:border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// Form Checkbox
interface FormCheckboxProps {
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
}

export function FormCheckbox({ 
  label, 
  description, 
  checked, 
  onCheckedChange, 
  required 
}: FormCheckboxProps) {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <div className="space-y-1">
        <Label 
          htmlFor={label} 
          className="text-sm font-normal cursor-pointer flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// Form Radio Group
interface FormRadioGroupProps {
  label: string;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  direction?: 'vertical' | 'horizontal';
}

export function FormRadioGroup({ 
  label, 
  options, 
  value, 
  onValueChange, 
  error, 
  description, 
  required,
  direction = 'vertical'
}: FormRadioGroupProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <RadioGroup 
        value={value} 
        onValueChange={onValueChange}
        className={direction === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-2'}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
            <div className="space-y-1">
              <Label 
                htmlFor={option.value} 
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
              {option.description && (
                <p className="text-xs text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// File Upload
interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesChange?: (files: File[]) => void;
  files?: File[];
  error?: string;
  description?: string;
  required?: boolean;
}

export function FileUpload({ 
  label, 
  accept = "image/*", 
  multiple = false, 
  maxSize = 5, 
  onFilesChange, 
  files = [], 
  error, 
  description, 
  required 
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });
    
    onFilesChange?.(multiple ? [...files, ...validFiles] : validFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange?.(newFiles);
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary hover:bg-accent'}
          ${error ? 'border-destructive' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground mb-1">
          파일을 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-xs text-muted-foreground">
          {accept === "image/*" ? "이미지 파일" : accept} • 최대 {maxSize}MB
          {multiple && " • 여러 파일 선택 가능"}
        </p>
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-accent rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}