## ADDED Requirements

### Requirement: Meta Description Tag
The `index.html` SHALL include a `<meta name="description">` tag with a concise, keyword-rich summary of the portfolio (max 160 characters).

#### Scenario: Search engine crawl
- **WHEN** a search engine crawler fetches the root URL
- **THEN** it SHALL find a `<meta name="description">` tag in the `<head>` with non-empty content of 50–160 characters.

### Requirement: Author Meta Tag
The `index.html` SHALL include a `<meta name="author">` tag identifying the portfolio owner.

#### Scenario: Author identification
- **WHEN** a crawler or social preview tool parses the HTML head
- **THEN** it SHALL find a `<meta name="author" content="Maurice ...">` tag.

### Requirement: Descriptive Title Tag
The `<title>` element SHALL contain a keyword-rich, descriptive title following the pattern `Name — Role | Domain`.

#### Scenario: Browser tab display
- **WHEN** a user opens the portfolio in a browser
- **THEN** the tab title SHALL display a descriptive title (not a generic placeholder like "Maurice Website").

### Requirement: Robots.txt
A `robots.txt` file SHALL exist at the web root (`public/robots.txt`) allowing all user agents.

#### Scenario: Crawler access
- **WHEN** a crawler requests `/robots.txt`
- **THEN** the server SHALL respond with a valid robots.txt containing `User-agent: *` and `Allow: /`.

### Requirement: Open Graph Basic Tags
The `index.html` SHALL include basic Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`) for social media preview.

#### Scenario: Social media share
- **WHEN** the portfolio URL is shared on a social platform
- **THEN** the platform SHALL render a preview card with the defined title and description.
