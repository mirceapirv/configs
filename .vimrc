" Vim Config file (~/.vimrc)
set t_Co=256
if &term =~ '256color'
" disable Background Color Erase (BCE) so that color schemes
" render properly when inside 256-color tmux and GNU screen.
" see also http://snk.tuxfamily.org/log/vim-256color-bce.html
  set t_ut=
endif
"==========================================================================="

" VimPLUG starts here
"==========================================================================="
call plug#begin()

Plug 'tpope/vim-sensible'
Plug 'scrooloose/nerdtree', { 'on': 'NERDTreeToggle' }
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'KeitaNakamura/neodark.vim'
Plug 'mxw/vim-jsx'
Plug 'elzr/vim-json'
Plug 'vim-syntastic/syntastic'
Plug 'pangloss/vim-javascript'
Plug 'scrooloose/syntastic'
Plug 'Valloric/YouCompleteMe'
Plug 'skammer/vim-swaplines'
Plug 'tpope/vim-fugitive'
Plug 'nathanaelkane/vim-indent-guides'
Plug 'rking/ag.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'jlanzarotta/bufexplorer'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-commentary'
Plug 'kana/vim-textobj-line'
Plug 'kana/vim-textobj-entire'
Plug 'kana/vim-textobj-user'
Plug 'moll/vim-bbye'
Plug 'jeetsukumaran/vim-buffergator'
Plug 'Xuyuanp/nerdtree-git-plugin'
Plug 'airblade/vim-gitgutter'
Plug 'joshdick/onedark.vim'
Plug 'sheerun/vim-polyglot'
Plug 'junegunn/limelight.vim'
Plug 'othree/javascript-libraries-syntax.vim'
Plug 'othree/yajs.vim'

call plug#end()
" VimPLUG ends here
"==========================================================================="

filetype plugin indent on
filetype plugin on

let g:ycm_server_python_interpreter = '/usr/bin/python'
" Color scheme
" =========================================================================="
" let g:neodark#use_256color = 1 " default: 0
" colorscheme neodark
let g:onedark_termcolors=256
colorscheme onedark

" With this, the gui (gvim) now doesn't have the toolbar, the left and right scrollbars and the menu.
set guioptions-=T
set guioptions-=l
set guioptions-=L
set guioptions-=r
set guioptions-=R
"set guioptions-=m
set guioptions-=M

" Key mappings
" =========================================================================="
nnoremap <silent> <C-p> :FZF<CR>
nnoremap <silent> <F3> :NERDTreeToggle<CR>
nmap ,cl :let @+=expand("%:p")<CR>
nnoremap <F5> :BufExplorer<CR>
nnoremap <F6> :MinimapToggle<CR>
vnoremap <C-r> "hy:%s/<C-r>h//gc<left><left><left>
vmap v <Plug>(expand_region_expand)
vmap <C-v> <Plug>(expand_region_shrink)
nnoremap <silent> <F12> :bn<CR>
nnoremap <silent> <C-x> :Bdelete<CR>
nnoremap  <silent> <tab>  :if &modifiable && !&readonly && &modified <CR> :write<CR> :endif<CR>:bnext<CR>
nnoremap  <silent> <s-tab>  :if &modifiable && !&readonly && &modified <CR> :write<CR> :endif<CR>:bprevious<CR>
nnoremap <silent> <C-S-L> :NERDTreeFind<CR>
nmap <C-o> O<Esc>
nmap <CR> o<Esc>
:command Gdt !git dt %
:map <C-j> cw<C-r>0<ESC>
:command WQ wq
:command Wq wq
:command W w
:nnoremap <c-z> :u<CR>      " Avoid using this**
inoremap <c-z> <c-o>:u<CR>command Q q

" Settings, flags, defaults
" =========================================================================="
set number
set nowrap

syntax on
set ruler
set number
set relativenumber
set colorcolumn=80
set cursorline
set incsearch
set hlsearch
set ignorecase
set laststatus=2
set showcmd
set showmatch
set wildmenu
set nowrap
set tabstop=2
set expandtab
set shiftwidth=2

set directory=~/.vim/swapfiles//
set backupdir=~/.vim/backup//
set backupcopy=yes
set clipboard=unnamedplus


let g:used_javascript_libs = 'underscore,react,requirejs,chai'
let g:sql_type_default = 'pgsql'
let g:Powerline_symbols = 'fancy'
let g:airline_powerline_fonts = 1
let g:airline#extensions#tabline#enabled = 1
let g:jedi#show_call_signatures = "1"

"syntastic
"=================================================================================

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

set statusline+=%{fugitive#statusline()}

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_loc_list_height = 5
let g:syntastic_auto_loc_list = 0
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 1
let g:syntastic_javascript_checkers = ['eslint']

let g:syntastic_error_symbol = "☠"
let g:syntastic_warning_symbol = "⚠"
let g:syntastic_style_error_symbol = "☢"
let g:syntastic_style_error_symbol = '⚠'

highlight link SyntasticErrorSign SignColumn
highlight link SyntasticWarningSign SignColumn
highlight link SyntasticStyleErrorSign SignColumn
highlight link SyntasticStyleWarningSign SignColumn

"Syntastic local linter support
let g:syntastic_javascript_checkers = []
function CheckJavaScriptLinter(filepath, linter)
	if exists('b:syntastic_checkers')
		return
	endif
	if filereadable(a:filepath)
		let b:syntastic_checkers = [a:linter]
		let {'b:syntastic_' . a:linter . '_exec'} = a:filepath
	endif
endfunction

function SetupJavaScriptLinter()
	let l:current_folder = expand('%:p:h')
	let l:bin_folder = fnamemodify(syntastic#util#findFileInParent('package.json', l:current_folder), ':h')
	let l:bin_folder = l:bin_folder . '/node_modules/.bin/'
	call CheckJavaScriptLinter(l:bin_folder . 'standard', 'standard')
	call CheckJavaScriptLinter(l:bin_folder . 'eslint', 'eslint')
endfunction

autocmd FileType javascript call SetupJavaScriptLinter()

" Mouse shit
" =========================================================================="
set mouse=n
set ttymouse=xterm2

"vim-expand-region
"================================================================================
"let g:expand_region_text_objects = {
"  \ 'il' :1,
"  \ 'ie' :1, }
"=================================================================================

"vim-indent-guides
"=================================================================================
let g:indent_guides_start_level=2
let g:indent_guides_guide_size=1
let g:indent_guides_auto_colors=0

"limelight
"=================================================================================
let g:limelight_priority = -1
let g:limelight_paragraph_span = 2

"colorscheme
"================================================================================
"Use 24-bit (true-color) mode in Vim/Neovim when outside tmux.
 "If you're using tmux version 2.2 or later, you can remove the outermost $TMUX check and use tmux's 24-bit color support
 "(see < http://sunaku.github.io/tmux-24bit-color.html#usage > for more information.)
 if (empty($TMUX))
   if (has("nvim"))
     "For Neovim 0.1.3 and 0.1.4 < https://github.com/neovim/neovim/pull/2198 >
     let $NVIM_TUI_ENABLE_TRUE_COLOR=1
   endif
   "For Neovim > 0.1.5 and Vim > patch 7.4.1799 < https://github.com/vim/vim/commit/61be73bb0f965a895bfb064ea3e55476ac175162 >
   "Based on Vim patch 7.4.1770 (`guicolors` option) < https://github.com/vim/vim/commit/8a633e3427b47286869aa4b96f2bfc1fe65b25cd >
   " < https://github.com/neovim/neovim/wiki/Following-HEAD#20160511 >
   if (has("termguicolors"))
     set termguicolors
   endif
 endif
"================================================================================
"
" EOF
" =========================================================================="
