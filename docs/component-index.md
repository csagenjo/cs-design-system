# Component index

One line per component, for choosing. An agent reads this first, picks the
pieces, and then reads only their full entry in `docs/component-inventory.md`
(props, sizing, accessibility). Pieces marked *internal* are not used on their
own.

Imports: atoms from `src/components/{Name}`, organisms from `src/organisms/{Name}`.
No barrel export. Screen-reader texts are in English and passed by prop.

## Actions

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Button | Text button, Accent or Default, Primary / Secondary / Tertiary, 3 sizes | Any action with a label | Navigating to another page (Link) · icon only (IconButton) |
| IconButton | Round icon-only button | Compact actions with a clear icon and an `ariaLabel` | Actions that need words to be understood (Button) |
| ButtonBar | Row of 1–3 buttons at the end of a form or dialog | Primary + secondary actions of a form | A toolbar inside a table (CellActions) |

## Forms

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| InputText | Text field with label, help and error | Free text, one line | Choosing from a list (InputDropdown, Combobox) |
| InputDropdown | Field that opens a Selector list | One value from a short list | Long lists to search (Combobox) |
| InputDate | Date field DD/MM/YYYY | A single date typed by the user | — |
| InputStepper | Number field with − / + buttons | Small quantities | Money (InputAmount) |
| InputTelephone | Prefix button + number | Phone numbers; opens CountryPicker | — |
| InputAmount | Currency button + amount | Money; opens CurrencyPicker | Showing an amount read-only (AmountView) |
| Combobox | Text field that filters a list (one value or chips) | Searching a long list | Short lists (InputDropdown) |
| InputCombobox | The field part of Combobox | *Internal* — use Combobox | — |
| CountryPicker | Floating list of countries with flag | Changing the phone prefix | Any other list (Combobox) |
| CurrencyPicker | Floating list of currencies | Changing the currency of an amount | Any other list (Combobox) |
| Selector | Field-like row that opens a list of options | Choosing one or several items with description | Plain short lists (InputDropdown) |
| SelectorInvoker · SelectorListItem | The field and the rows of Selector | Building a Selector panel | — |
| AccountSelector | Selector for bank accounts (name, number, balance) | Choosing an account | Other items (Selector) |
| AccountSelectorInvoker · AccountSelectorListItem | The field and the rows of AccountSelector | Building an account panel | — |
| Checkbox | Check with label; the whole row is the control | Several independent yes/no choices | Settings applied immediately (Switch) |
| CheckboxGroup | Question + checkboxes with group help and error | Any set of checkboxes in a form | — |
| Radio | Radio with label; the whole row is the control | One of several options (inside RadioGroup) | Changing a view (SegmentedControl) |
| RadioGroup | Question + radios with group help and error | One choice among 2–6 options in a form | More than ~6 options (InputDropdown) |
| Switch | On/off toggle applied immediately | Settings that take effect at once | Form answers submitted later (Checkbox) |
| Chip | Small pill: filter, choice or input tag | Active filters and tags | Primary actions (Button) |
| SegmentedControl | 2–5 pills, one selected | Switching a view (Day · Week · Month) | Form values (RadioGroup) · panels of content (Tabs) |
| Slider | Drag one value on a track | Approximate values (volume, opacity) | Exact numbers (InputStepper, InputAmount) |
| RangeSlider | Two knobs for min and max | Ranges (price) | Exact numbers (two inputs) |
| SteppedSlider | Slider with fixed stops | One of a few steps | — |
| FieldLabel · HelperText · ValidationMessage | Label, help text and error under a field | Building custom fields | — (inputs already include them) |
| FileUpload | Drop zone + file list | Uploading files | — |
| FileSelector · DropZone · DocumentItem · LabelDescription | Parts of FileUpload | Custom upload layouts | — |

## Data

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Table | Data table with sort, selection and states | Lists of records to compare by columns | Few fields of one record (DescriptionList) |
| TableRow · CellHeader · CellData · CellMore · CellActions | Rows and cells of Table | Building a Table | — |
| ListView | Interactive row with title, description, icon, control | Lists of items to open or select | Static bullet text (List) |
| DescriptionList | Label–value pairs, with optional section title | Details of one record | Comparing many records (Table) |
| AmountView | Formatted amount with currency, highlight and sign | Showing money read-only | Typing money (InputAmount) |
| List | Bullet, numbered or check list | Short scannable text | Interactive rows (ListView) |
| Card | Surface that groups content (Basic elevated, Full flat) | Grouping a block on a page | Lists of rows (ListView) |
| Image | Picture at a fixed ratio, optional caption | Photos and illustrations | Icons (Icon) |
| Divider | Hairline between groups | Separating blocks | Spacing alone is enough |
| CountryFlag | Real flag, one size | Next to a country name or prefix | Decoration |

## Feedback

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Snackbar | Temporary message at the bottom, optional action | Confirming an action ("Saved") | Errors that must stay (InlineNotification) |
| InlineNotification | Message inside the page: info, success, warning, error | Persistent messages about a section | A blocking decision (Dialog) |
| Tooltip | Small bubble on hover / focus | A short hint about a control | Content with actions (PopoverSheet) |
| LoadingSpinner | Spinning indicator | Loading of unknown length | Progress you can measure (ProgressBar) |
| ProgressBar | Bar with percentage, label and help | Measurable progress | Unknown length (LoadingSpinner) |
| BadgeNotification | Counter dot or number | Unread counts | Status (BadgeHighlight) |
| BadgeHighlight | Status label with icon and tooltip | Status of a record | Counts (BadgeNotification) |

## Navigation

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| TopNavigation | Page header with mega-menu | The top bar of La Plataforma | — |
| SidebarMenu | Collapsible side menu | Section navigation in La Plataforma | — |
| PageTitle | Page heading with back link and actions | The title of every page (level 1) | Section titles (Headline) |
| Tabs | Tabs with panels | Switching between panels of one page | Changing a view filter (SegmentedControl) |
| TabItem · TabPanel | Parts of Tabs | Custom tab layouts | — |
| Link | Text link (or button-looking text without href) | Going to another page or inline actions | Main actions (Button) |
| LinkList | Titled list of links | Groups of related links | — |
| CTALink | Prominent link with arrow | One call to action in content | Form actions (Button) |
| Pagination | Page numbers with arrows | Lists split into pages | Steps of a process (StepIndicator) |

## Steps

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| StepIndicatorLarge | Horizontal steps of a process | Wizard header on wide screens | — |
| StepIndicatorSmall | "Step X of Y" with the current step | Wizard header on narrow screens | — |
| StepNavigator · SubstepNavigator | Vertical list of chapters and sub-steps | Long processes with sections | Short wizards (StepIndicator) |
| Node · StepHor · StepVer | Step circle and connectors | *Internal* — use the components above | — |

## Content

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Headline | Heading h1–h6, 6 responsive sizes | Page and section titles | Titles of rows and lists (SectionHeader) |
| SectionHeader | Title of a group (16 / 19) | Titles inside ListView, Selector, DescriptionList | The page title (PageTitle / Headline) |
| Text | Short emphasised label, optional chevron | Description slot of a row | Clickable text (Link) |
| DescriptionText | Secondary text under a title | One line that explains a title | Icon + value (DetailText) |
| DetailText | Icon + short value | Phone, account number, date under a title | Sentences (DescriptionText) |

## Overlays

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Dialog | Modal with title, content and buttons | Decisions or forms that block the page | Non-blocking info (PopoverSheet) |
| DialogSimple | Short modal message with one or two buttons | Confirmations | — |
| ErrorAndEmptyState | Illustration + message + action | Empty lists and errors filling a page area | Small messages (InlineNotification) |
| Scrim | Dark layer behind a modal | *Internal* — Dialog and Drawer add it | — |
| PopoverSheet | Floating card attached to a button | Extra detail or 1–3 actions about one element | Blocking decisions (Dialog) · hints (Tooltip) |

## Page structure and layout

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Accordion · AccordionGroup | Sections that open one by one | Long pages split into sections | One block that grows (Collapsible) |
| Collapsible · CollapsibleIconButton | Expand / Collapse trigger | Showing more of one block in place | Several sections (AccordionGroup) |
| Drawer | Side or top panel that collapses | Secondary panels and the sidebar | Modals (Dialog) |

## Foundations

| Component | What it is | Use it for | Not for (use instead) |
|---|---|---|---|
| Icon | Every Lucide icon, sizes 16–64, stroke 2 | Icons anywhere | Drawing local icons |
| VisuallyHidden | Text only for screen readers | Extra context for assistive tech | Hiding content from everyone |
| LiveRegion · `announce` | Region that announces changes | Errors and results that appear without focus | — |
