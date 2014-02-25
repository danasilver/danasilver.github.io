---
layout: post
title: Sochi 2014 Athletes
date: 2014-02-25 05:42:23 EST
---

<style>
p > img {
  margin: auto;
  text-align: center
}
</style>

An analysis of the athletes of the 2014 Winter Olympics at Sochi using R.

### Data

The data contains details about each of the 2859 athletes who competed in the 2014 Winter Olympics.  Those details are age, birthdate, gender, height, name, weight, medal counts, sport, and country.  The data was originally retrieved in JSON format from Kimono Lab's [Sochi API](http://sochi.kimonolabs.com/api/athletes) on February 18, 2014.  I converted the JSON to CSV using Python so it could be easily imported into R and used as a data frame.  Download the converted CSV at [danasilver.org/static/assets/sochi-2014-athletes/athletes.csv](/static/assets/sochi-2014-athletes/athletes.csv).

### Height and Weight by Sport

<center>
<a href="/static/assets/sochi-2014-athletes/sport_weight_height.png">![Height and Weight by Sport](/static/assets/sochi-2014-athletes/sport_weight_height.png)</a>
</center>

```r
ggplot(athletes, aes(x=weight, y=sport)) +
       geom_point(aes(size=height), alpha=1/5) +
       xlab("weight (kg)") +
       guides(size=guide_legend(title="height (m)"))
```

The goal of this chart is to visualize the height and weight of athletes competing in each sport.  The results make sense, considering each sport.  Cross Country and Biathlon, where athletes race up to 50 km (31.1 miles), are on the lower side of the chart, with weights mostly in the range of 50 to 90 kg (110 to 200 lb).  Ice Hockey and Bobsleigh athletes have the greatest weights, with some athletes at or just below 120 kg (264 lb).  Heavy Bobsleigh teams are desireable as they tend to go faster.  In 1952 a weight limit was imposed, limiting teams to 630 kg (1390 lb) total.  Height (shown by point size) has a positive correlation with weight.  That is, as weight increases, so does height.  This is true across all the sports.  Interestingly, Figure Skating has no weights listed.  Figure Skating, unlike other sports, has no official weighing in.

### Age

<center>
<a href="/static/assets/sochi-2014-athletes/age.png">![Age](/static/assets/sochi-2014-athletes/age.png)</a>
</center>

```r
ggplot(athletes, aes(factor(age))) +
       geom_bar() +
       xlab("age (years)")
```

Moving beyond the sports, it is interesting to see the how old (or young) the athletes are. Most athletes, as expected, are aged 20 to 30 with over 150 each aged 22 to 29. It is clear that highly competitive winter athletes peak around these ages. The extremes of the data, 15 and 55 years, raise the question of who is competing at these ages. The IOC does not set a minimum age to compete, leaving it up to the governing bodies of each sport. Figure Skating has the lowest requirement at 15 years. On the other side of the spectrum is Mexican alpine skier (and photographer/businessman/pop singer) [Hubertus von Hohenlohe](http://en.wikipedia.org/wiki/Prince_Hubertus_of_Hohenlohe-Langenburg), the oldest athlete who competed in Sochi, at age 55.

### Countries by Number of Athletes and Gender

<center>
<a href="/static/assets/sochi-2014-athletes/athletes_per_country.png">![Countries by Number of Athletes and Gender](/static/assets/sochi-2014-athletes/athletes_per_country.png)</a>
</center>

First sort the data by number of athletes per country:

```r
athletes_country <- within(athletes,
                           country <- factor(country,
                                             levels=names(sort(table(country), decreasing=FALSE))))
```

Create the chart:

```r
ggplot(athletes_country, aes(country, fill=gender)) +
       geom_bar() +
       scale_fill_manual(values=c("Male"="lightblue", "Female"="pink")) +
       ylab("# athletes") +
       coord_flip()
```

This chart answers two questions about the data. First, it addresses which countries sent the most and least athletes. The United States, Russia, and Canada come out on top, each sending over 200 athletes. All countries listed between Bermuda and Zimbabwe sent only one athlete. Second, the chart reveals the how many men and women came from each country. Most countries that sent more than one or two athletes have an close number of men and women. The number of men is usually slightly more, however, as the total number of male competitors at the Olympics was greater than female competitors. The top five countries (United States, Russia, Canada, Switzerland, Germany) fit this trend. Austria and Norway, the next two, sent notably more men than women. Latvia has the lowest female to male ratio. They sent 57 athletes only 7 of whom were female. This is in part due almost half their team (25 of 57 members) being male Ice Hockey players. Other countries with more representation sent both a men’s and women’s team. Another 8 men are Latvia’s only bobsledders. The next chart addresses this sport based gender disparity.

### Countries by Number of Athletes, Sport, and Gender

<center>
<a href="/static/assets/sochi-2014-athletes/country_gender_sport.png">![Countries by Number of Athletes, Sport, and Gender](/static/assets/sochi-2014-athletes/country_gender_sport.png)</a>
</center>

```r
ggplot(athletes_country, aes(country, fill=sport, alpha=gender)) +
       geom_bar(position="stack") +
       scale_alpha_manual(values=c(0.5, 1)) +
       ylab("# athletes") +
       coord_flip()
```

This chart attempts to answer the question of gender disparity by country. Some of this disparity arises due to the sport. For example, Ice Hockey teams are large at 25 players and make up a sizable portion of a country’s representation, especially if that representation is proportionally small. In the previous chart, it was clear that Austria and Norway, the sixth and seventh most represented countries respectively, had a much higher male to female ratio than the first five countries. In this sport and gender based breakdown, it is obvious this disparity arises in part because the top five countries have both men’s and women’s Ice Hockey teams, while Austria and Norway only have men’s teams. For the most part, those countries’ other sports are similarly split between men and women. This chart reveals that Japan has a women’s hockey team, but not a men’s. This is why Japan sent more women than men to the Olympics. This chart also reveals how many athletes from each country participate in each sport. Some examples of this are that most of Netherlands’s athletes are speed skaters and that most of Denmark’s are curlers (10 out of 12 to be precise). This data is somewhat difficult to read, however, due to the similarity in color between some of the sports, which arises because of the number of sports. Examining fewer countries in more physical space might fix this problem.