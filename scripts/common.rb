def safe_colorize(text, color)
    begin
        require 'colorize'
        return text.colorize(color)
    rescue LoadError
        return text
    end
end